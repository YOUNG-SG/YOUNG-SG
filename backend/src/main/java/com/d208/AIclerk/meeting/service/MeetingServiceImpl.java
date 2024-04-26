package com.d208.AIclerk.meeting.service;


import com.d208.AIclerk.entity.Comment;
import com.d208.AIclerk.entity.MeetingDetail;
import com.d208.AIclerk.exception.meeting.CommentException;
import com.d208.AIclerk.meeting.dto.requestDto.CreateCommentRequestDto;
import com.d208.AIclerk.meeting.dto.requestDto.OpenAiRequestDto;
import com.d208.AIclerk.meeting.dto.response.CommentDeleteResponse;
import com.d208.AIclerk.meeting.dto.response.CreateCommentResponse;
import com.d208.AIclerk.meeting.repository.CommentRepository;
import com.d208.AIclerk.meeting.repository.MeetingDetailRepository;
import com.d208.AIclerk.utill.OpenAiUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class MeetingServiceImpl implements MeetingService {

    private final OpenAiUtil openAiUtil;

    private final MeetingDetailRepository meetingDetailRepository;
    private final CommentRepository commentRepository;

    // OpenAi 텍스트 요약
    @Override
    public ResponseEntity<String> sendText(OpenAiRequestDto dto) throws Exception {

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
        1. 회의 방 이름 넣기
        2. 참여자 명단 받아오기
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


//        // 이미 작성된 코멘트가 있을 때
//        if (commentRepository.findByIdAndUserId(, currentMember).isPresent()){
//            throw CommentException.commentExistException();
//        }

        // 댓글 작성 안하거나 길이가 넘을 때
        if (dto.getContent() == null || dto.getContent().isEmpty() || dto.getContent().length() > 200) {
            throw CommentException.commentLengthException();
        }


        Comment comment = Comment.builder()
                .content(dto.getContent())
                .createAt(LocalDateTime.now())
                .build();

        commentRepository.save(comment);

        CreateCommentResponse response = new CreateCommentResponse("댓글 작성 성공");

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Transactional
    @Override
    public ResponseEntity<CommentDeleteResponse> deleteComment(Long commentId) {

        // 대상 코멘트가 있는지 확인 및 수정
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(CommentException::commentNotFoundException);

//        // 코멘트 주인과 접속 유저가 같은지 확인
//        if (!Objects.equals(comment.getMemberId().getId(), currentMember.getId())) {
//            throw CommentException.memberNotEqualException();
//        }

        // 삭제
        commentRepository.delete(comment);
        commentRepository.deleteById(commentId);

        CommentDeleteResponse response = new CommentDeleteResponse("댓글 삭제 성공");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
