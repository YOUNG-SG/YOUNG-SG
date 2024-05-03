package com.d208.AIclerk.meeting.service;


import com.d208.AIclerk.chatting.repository.RoomRepository;
import com.d208.AIclerk.entity.*;
import com.d208.AIclerk.exception.meeting.CommentException;
import com.d208.AIclerk.exception.meeting.FolderException;
import com.d208.AIclerk.exception.meeting.MeetingDetailException;
import com.d208.AIclerk.meeting.dto.requestDto.CreateCommentRequestDto;
import com.d208.AIclerk.meeting.dto.requestDto.CreateFolderRequestDto;
import com.d208.AIclerk.meeting.dto.requestDto.OpenAiRequestDto;
import com.d208.AIclerk.meeting.dto.requestDto.SaveMeetingRequestDto;
import com.d208.AIclerk.meeting.dto.response.*;
import com.d208.AIclerk.meeting.dto.responseDto.*;
import com.d208.AIclerk.meeting.repository.*;
import com.d208.AIclerk.utill.CommonUtil;
import com.d208.AIclerk.utill.OpenAiUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MeetingServiceImpl implements MeetingService {

    private final OpenAiUtil openAiUtil;
    private final CommonUtil commonUtil;

    private final MeetingDetailRepository meetingDetailRepository;
    private final CommentRepository commentRepository;
    private final FolderRepository folderRepository;
    private final MemberMeetingRepository memberMeetingRepository;
    private final RoomRepository roomRepository;
    private final ParticipantRepository participantRepository;

    // OpenAi 텍스트 요약 및 meetingDetail 저장
    @Override
    public ResponseEntity<String> summaryText(OpenAiRequestDto dto) throws Exception {

        String inputText = dto.getText();

        StringBuilder fullSummary = new StringBuilder();

        // 글자수 제한 확인
        final int MAX_LENGTH = 4000;
        while (!inputText.isEmpty()) {
            String partOfText;
            if (inputText.length() > MAX_LENGTH) {
                partOfText = inputText.substring(0, MAX_LENGTH);
                inputText = inputText.substring(MAX_LENGTH);
            } else {
                partOfText = inputText;
                inputText = "";
            }

            // 텍스트 요약
            String result = openAiUtil.summarizeText(partOfText);
            fullSummary.append(result);
            fullSummary.append(" "); // 부분 요약들을 구분하기 위해 공백 추가
        }

        MeetingRoom meetingRoom = roomRepository.findById(dto.getRoomId())
                .orElseThrow();

        // 회의 상세 저장
        MeetingDetail meetingDetail = MeetingDetail.builder()
                .summary(fullSummary.toString())
                .title(meetingRoom.getTitle())
                .meetingRoom(meetingRoom)
                .build();

        meetingDetailRepository.save(meetingDetail);

        return ResponseEntity.ok("회의 상세(meeting_detail) 저장 성공");
    }


    // 댓글 기능 구현
    @Override
    public ResponseEntity<CreateCommentResponse> createComment(CreateCommentRequestDto dto) {

        Member currentMember = commonUtil.getMember();

        MeetingDetail meetingDetail = meetingDetailRepository.findById(dto.getMeetingId())
                .orElseThrow(MeetingDetailException::meetingDetailNotFoundException);

        // 댓글 작성 안하거나 길이가 넘을 때
        if (dto.getContent() == null || dto.getContent().isEmpty() || dto.getContent().length() > 200) {
            throw CommentException.commentLengthException();
        }


        Comment comment = Comment.builder()
                .meetingDetail(meetingDetail)
                .content(dto.getContent())
                .member(currentMember)
                .createAt(LocalDateTime.now())
                .build();

        commentRepository.save(comment);

        CreateCommentResponse response = new CreateCommentResponse("댓글 작성 성공");

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Transactional
    @Override
    public ResponseEntity<CommentDeleteResponse> deleteComment(Long commentId) {

        Member currentMember = commonUtil.getMember();

        // 대상 코멘트가 있는지 확인 및 수정
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(CommentException::commentNotFoundException);

        // 코멘트 주인과 접속 유저가 같은지 확인
        if (!Objects.equals(comment.getMember().getId(), currentMember.getId())) {
            throw CommentException.memberNotEqualException();
        }

        // 삭제
        commentRepository.delete(comment);
        commentRepository.deleteById(commentId);

        CommentDeleteResponse response = new CommentDeleteResponse("댓글 삭제 성공");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Override
    public ResponseEntity<MeetingDetailResponse> readMeetingDetail(Long roomId) {

        // 반환해 줄 dto
        MeetingDetailResponseDto dto = new MeetingDetailResponseDto();

        // 회의방에 연결되어 있는 상세페이지 찾아오기 (1개밖에 없음)
        MeetingDetail meetingDetail = meetingDetailRepository.findByMeetingRoom_Id(roomId);


        // 하나씩 찾아서 넣어주기

        // detailId
        dto.setDetailId(meetingDetail.getId());
        // 요약 내용
        dto.setSummary(meetingDetail.getSummary());
        // 다음 회의

        // 참여자 목록 조회
        List<Participant> participantList = participantRepository.findAllByMeetingRoom_Id(roomId);
        List<ParticipantInfoDto> participantInfoDtos = participantList.stream()
                .map(participant -> {
                    ParticipantInfoDto infoDto = new ParticipantInfoDto();
                    infoDto.setNickName(participant.getMember().getNickname());
                    infoDto.setProfile(participant.getMember().getImage());
                    return infoDto;
                }).collect(Collectors.toList());

        dto.setParticipantInfoDtoList(participantInfoDtos);
        // 파일 다운로드 링크


        MeetingDetailResponse response = new MeetingDetailResponse("상세 페이지 조회 성공", dto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Override
    public ResponseEntity<DetailListResponse> readDetailList(Long folderId) {
        // Member_meeting 에 접근 : folder_id 같은 것 뽑아오기
        // 뽑아온 member_meeting_list를 하나씩 돌면서 detail_id에 접근하여 DetailListResponseDto 정보 뺴오기
        // DetailListResponseList 뽑아서 DetailListResponse에 넣어주기

        return null;
    }

    @Override
    public ResponseEntity<CreateFolderResponse> createFolder(CreateFolderRequestDto dto) {

        Member currentMember = commonUtil.getMember();
        // title 길이 조절
        if (dto.getTitle() == null || dto.getTitle().isEmpty() || dto.getTitle().length() > 10) {
            throw FolderException.folderTitleLengthException();
        }

        // 폴더 이름을 받아와서 엔터티에 이름과 생성 날짜를 넣어준다. 끝?
        Folder newFolder = Folder.builder()
                .title(dto.getTitle())
                .createAt(LocalDateTime.now())
                .member(currentMember)
                .build();

        folderRepository.save(newFolder);

        CreateFolderResponse response = new CreateFolderResponse("폴더 생성 성공", true);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Override
    public ResponseEntity<FolderResponse> readFolderList() {

        Member currentMember = commonUtil.getMember();

        Long totalTime = 12323L;

        // memberId 로 멤버의 폴더들 모두 조회
        List<Folder> folderList = folderRepository.findAllByMemberId(currentMember.getId());

        if (folderList.isEmpty()){
            throw FolderException.folderNotFoundException();
        }

        List<FolderResponseDto> folderResponseDtoList = folderList.stream()
                .map(folder -> new FolderResponseDto(
                        folder.getId(),
                        folder.getTitle(),
                        totalTime
                ))
                .toList();


        // 리스트들을 반환 해준다.
        FolderResponse response = new FolderResponse("폴더 목록 조회 성공", folderResponseDtoList);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Override
    public ResponseEntity<ReadCommentResponse> readComment(Long detailId) {

        List<Comment> comments = commentRepository.findAllByMeetingDetail_Id(detailId);

        if (comments.isEmpty()){
            throw CommentException.commentNotFoundException();
        }

        log.info("(댓글들) {}", comments);
        // CommentResponseDto 리스트로 변환
        List<CommentResponseDto> commentResponseDtoList = comments.stream()
                .map(comment -> new CommentResponseDto(
                        comment.getId(),
                        comment.getMember().getId(),
                        comment.getMember().getNickname(),
                        comment.getMember().getImage(),
                        comment.getContent(),
                        comment.getCreateAt()
                ))
                .toList();


        log.info("(MeetingServiceImpl) 댓글리스트{}", commentResponseDtoList);

        ReadCommentResponse response = new ReadCommentResponse("댓글 리스트 조회", commentResponseDtoList, commonUtil.getMember().getId());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @Override
    public ResponseEntity<SaveMeetingResponse> saveMeeting(SaveMeetingRequestDto dto) {

        Member currentMember = commonUtil.getMember();

        Folder folder = folderRepository.findById(dto.getFolderId())
                .orElseThrow(FolderException::folderNotFoundException);

        MemberMeeting memberMeeting = MemberMeeting.builder()
                .member(currentMember)
                .folder(folder)
                .roomId(dto.getRoomId())
                .build();

        memberMeetingRepository.save(memberMeeting);

        SaveMeetingResponse response = new SaveMeetingResponse("회의정보가 개인폴더에 저장되었습니다.");

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


}
