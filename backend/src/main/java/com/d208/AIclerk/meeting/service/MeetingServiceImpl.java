package com.d208.AIclerk.meeting.service;


import com.d208.AIclerk.chatting.repository.RoomRepository;
import com.d208.AIclerk.entity.*;
import com.d208.AIclerk.entity.File;
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
import com.d208.AIclerk.security.WordDocumentUpdater;
import com.d208.AIclerk.utill.CommonUtil;
import com.d208.AIclerk.utill.OpenAiUtil;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
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


    @Autowired
    private WordDocumentUpdater wordDocumentUpdater;
    @Override
    @Transactional
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
            fullSummary.append(" ");
        }

        MeetingRoom meetingRoom = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new NoSuchElementException("Meeting room not found with id: " + dto.getRoomId()));

        // 이미 저장된 상세페이지가 있는지 예외처리
        if (meetingDetailRepository.findByMeetingRoom_Id(meetingRoom.getId()) != null) {
            throw MeetingDetailException.existDetailException();
        }



        // Optional을 사용하여 null이면 현재 시간을 반환
        LocalDateTime startTime = Optional.ofNullable(meetingRoom.getStartTime())
                .orElse(LocalDateTime.now()); // null 일 경우 현재 시간 반환

        LocalDateTime endTime = Optional.ofNullable(meetingRoom.getEndTime())
                .orElse(LocalDateTime.now()); // null 일 경우 현재 시간 반환

        log.info("(진짜 시간) {}, {}", meetingRoom.getStartTime(), meetingRoom.getEndTime());
        log.info("시간 테스트{}, {}", startTime, endTime);


        // 회의 상세 저장

        MeetingDetail meetingDetail = MeetingDetail.builder()
                .summary(fullSummary.toString())
                .title(meetingRoom.getTitle())
                .meetingRoom(meetingRoom)
                .createAt(startTime)
                .totalTime(Duration.between(startTime, endTime).toMinutes())
                .build();

        // 먼저 MeetingDetail 저장
        meetingDetailRepository.save(meetingDetail);
        log.info("1 detailId{}", meetingDetail.getId());

        // 파일 업로드
        String bucketName = "youngseogi";
        String key = "test_test.docx";
        InputStream inputStream = wordDocumentUpdater.getFileFromS3(bucketName, key);

        String meetingRoomTitle = meetingRoom.getTitle();
        String encodedTitle = URLEncoder.encode(meetingRoomTitle, StandardCharsets.UTF_8.toString()).replace("+", "%20");
        String newFileName = encodedTitle + "_" + WordDocumentUpdater.getCurrentTimeFormatted() + ".docx";
        String newKey = "SummaryFolder/" + newFileName;

        try {
            wordDocumentUpdater.updateDocument(inputStream, bucketName, newKey, meetingRoom.getTitle(), fullSummary.toString(), List.of("홍길동", "김개똥", "이민정", "신민아", "김광석"), meetingDetail.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update document: " + e.getMessage());
        }

        return ResponseEntity.ok("회의 상세(meeting_detail) 저장 성공 및 파일 업로드 완료");
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

        Member currentMember = commonUtil.getMember();

        // 반환해 줄 dto
        MeetingDetailResponseDto dto = new MeetingDetailResponseDto();

        // 회의방에 연결되어 있는 상세페이지 찾아오기 (1개밖에 없음)
        MeetingDetail meetingDetail = meetingDetailRepository.findByMeetingRoom_Id(roomId);


        // 하나씩 찾아서 넣어주기

        // detailId
        dto.setDetailId(meetingDetail.getId());
        // 요약 내용
        dto.setSummary(meetingDetail.getSummary());

        // 시간
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        // LocalDateTime을 원하는 문자열 형식으로 변환
        if (meetingDetail.getCreateAt() != null) {
            String formattedDate = meetingDetail.getCreateAt().format(formatter);
            dto.setDate(formattedDate);
        } else {
            dto.setDate("생성 시간이 없습니다.");
        }


        //Todo 이전, 다음 회의
        Object[] detailIds = memberMeetingRepository.findPreviousAndNextDetailIds(currentMember.getId(), roomId)
                .orElseThrow(MeetingDetailException::preAndNextDetailNotFoundException);


        log.info("(뭔데) {} ", detailIds);
        Long preMeetingId = null;
        Long nextMeetingId = null;

        if (detailIds == null || detailIds.length == 0) {
            dto.setPreMeetingId(preMeetingId);
            dto.setNextMeetingId(nextMeetingId);
        } else {
            Object[] detailIdList = (Object[]) detailIds[0];
            if (detailIdList[0] != null && !detailIdList[0].equals(0L)) {
                preMeetingId = (Long) detailIdList[0];
            }

            if (detailIdList[1] != null && !detailIdList[1].equals(0L)) {
                nextMeetingId = (Long) detailIdList[1];
            }

            dto.setPreMeetingId(preMeetingId);
            dto.setNextMeetingId(nextMeetingId);
        }



        //Todo 파일 다운로드 링크


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


        MeetingDetailResponse response = new MeetingDetailResponse("상세 페이지 조회 성공", dto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Override
    public ResponseEntity<DetailListResponse> readDetailList(Long folderId) {


        // Member_meeting 에 접근 : folder_id 같은 것 뽑아오기
        List<MemberMeeting> memberMeetingList = memberMeetingRepository.findAllByFolder_Id(folderId);
        // 뽑아온 member_meeting_list를 하나씩 돌면서 detail_id에 접근하여 DetailListResponseDto 정보 뺴오기
        List<DetailListResponseDto> detailListResponseDtos = memberMeetingList.stream()
                .map(memberMeeting -> {
                    DetailListResponseDto detailListResponseDto = new DetailListResponseDto();
                    MeetingDetail detail = meetingDetailRepository.findByMeetingRoom_Id(memberMeeting.getRoomId());
                    Long commentCnt = commentRepository.countAllByMeetingDetail_Id(detail.getId());


                    Long meetingRoomId = Optional.ofNullable(detail.getMeetingRoom())
                            .map(MeetingRoom::getId)
                            .orElse(0L);

                    Long participantCnt = participantRepository.countAllByMeetingRoom_Id(meetingRoomId);

                    // 날짜 형식 변환
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");

                    if (detail.getCreateAt() == null) {
                        detailListResponseDto.setDate("시간이 등록되어있지 않습니다.");
                    } else {
                        String formattedDate = detail.getCreateAt().format(formatter);
                        detailListResponseDto.setDate(formattedDate);
                    }

                    detailListResponseDto.setDetailId(detail.getId());
                    detailListResponseDto.setTitle(detail.getTitle());
                    detailListResponseDto.setTotalTime(detail.getTotalTime());
                    detailListResponseDto.setCommentCnt(commentCnt);
                    detailListResponseDto.setParticipantCnt(participantCnt);
                    return detailListResponseDto;
                }).toList();

        // DetailListResponseList 뽑아서 DetailListResponse에 넣어주기
        DetailListResponse response = new DetailListResponse("상세페이지 리스트 조회 성공", detailListResponseDtos);

        return ResponseEntity.status(HttpStatus.OK).body(response);
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

        // memberId 로 멤버의 폴더들 모두 조회
        List<Folder> folderList = folderRepository.findAllByMemberId(currentMember.getId());

        List<FolderResponseDto> folderResponseDtoList = folderList.stream()
                .map(folder -> {
                    // 날짜 포맷을 정의 (예: 2013년 3월 10일)
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
                    // LocalDateTime을 원하는 문자열 형식으로 변환
                    String formattedDate = folder.getCreateAt().format(formatter);

                    // DTO 생성
                    return new FolderResponseDto(
                            folder.getId(),
                            folder.getTitle(),
                            formattedDate  // 문자열로 변환된 날짜 사용
                    );
                })
                .collect(Collectors.toList());


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
