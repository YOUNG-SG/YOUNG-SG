package com.d208.AIclerk.meeting.service;


import com.d208.AIclerk.entity.*;
import com.d208.AIclerk.exception.meeting.CommentException;
import com.d208.AIclerk.exception.meeting.FolderException;
import com.d208.AIclerk.exception.meeting.MeetingDetailException;
import com.d208.AIclerk.meeting.dto.requestDto.CreateCommentRequestDto;
import com.d208.AIclerk.meeting.dto.requestDto.CreateFolderRequestDto;
import com.d208.AIclerk.meeting.dto.requestDto.OpenAiRequestDto;
import com.d208.AIclerk.meeting.dto.requestDto.SaveMeetingRequestDto;
import com.d208.AIclerk.meeting.dto.response.*;
import com.d208.AIclerk.meeting.dto.responseDto.CommentResponseDto;
import com.d208.AIclerk.meeting.dto.responseDto.DetailListResponseDto;
import com.d208.AIclerk.meeting.dto.responseDto.FolderResponseDto;
import com.d208.AIclerk.meeting.dto.responseDto.MeetingDetailResponseDto;
import com.d208.AIclerk.meeting.repository.CommentRepository;
import com.d208.AIclerk.meeting.repository.FolderRepository;
import com.d208.AIclerk.meeting.repository.MeetingDetailRepository;
import com.d208.AIclerk.meeting.repository.MemberMeetingRepository;
import com.d208.AIclerk.security.WordDocumentUpdater;
import com.d208.AIclerk.utill.CommonUtil;
import com.d208.AIclerk.utill.OpenAiUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;

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

    // OpenAi 텍스트 요약
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

        /*
        해야 할 일
        1. 회의 방 이름 넣기 (meetingDetail.title)

        2. 참여자 명단 받아오기 (participant)

        3. createFile 호출하기
         */

        log.info("(MeetingServiceImpl) Original: {}", dto.getText());
        log.info("(MeetingServiceImpl) Summary: {}", fullSummary);

        MeetingDetail meetingDetail = new MeetingDetail();
        meetingDetail.setSummary(fullSummary.toString());
        meetingDetailRepository.save(meetingDetail);

        return ResponseEntity.ok("저장 성공");
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
        MeetingDetail meetingDetail = meetingDetailRepository.findById(roomId)
                .orElseThrow(MeetingDetailException::meetingDetailNotFoundException);

        // 하나씩 찾아서 넣어주기

        // 요약 내용
        dto.setSummary(meetingDetail.getSummary());

        // 다음 회의


        // 참여자 목록

        // 파일 다운로드 링크


        MeetingDetailResponse response = new MeetingDetailResponse("상세 페이지 조회 성공", dto);
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
    public ResponseEntity<DetailListResponse> readDetailList(Long folderId) {
        return null;
    }

    @Override
    public ResponseEntity<SaveMeetingResponse> saveMeeting(SaveMeetingRequestDto dto) {

        Member currentMember = commonUtil.getMember();

        Folder folder = folderRepository.findById(dto.getFolderId())
                .orElseThrow(FolderException::folderNotFoundException);

        MeetingDetail meetingDetail = meetingDetailRepository.findById(dto.getDetailId())
                .orElseThrow(MeetingDetailException::meetingDetailNotFoundException);

        MemberMeeting memberMeeting = MemberMeeting.builder()
                .member(currentMember)
                .folder(folder)
                .meetingDetail(meetingDetail)
                .build();

        memberMeetingRepository.save(memberMeeting);

        SaveMeetingResponse response = new SaveMeetingResponse("회의정보가 개인폴더에 저장되었습니다.");

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public ResponseEntity<MeetingDetailResponse> fileTest(Long fileId) {
        String bucketName = "style-finder-bucket"; // S3 버킷 이름
        String key = "test_test.docx"; // S3에서 가져올 원본 파일 키
        InputStream inputStream = WordDocumentUpdater.getFileFromS3(bucketName, key);

        String newFileName = "회의록_" + WordDocumentUpdater.getCurrentTimeFormatted() + ".docx";
        String newKey = "output/" + newFileName; // S3에 저장될 새 파일의 키
        List<String> attendees = List.of("홍길동", "김개똥", "이민정", "신민아", "김광석");

        MeetingDetail meetingDetail = meetingDetailRepository.findById(fileId)
                .orElseThrow(() -> new NoSuchElementException("Meeting detail not found with id: " + fileId));
        String content = meetingDetail.getSummary();

        WordDocumentUpdater.updateDocument(inputStream, bucketName, newKey, "이건 제목입니당", content, attendees);

        return ResponseEntity.ok().build();
    }

}
