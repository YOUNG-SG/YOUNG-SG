package com.d208.AIclerk.meeting.service;

import com.d208.AIclerk.meeting.dto.requestDto.CreateCommentRequestDto;
import com.d208.AIclerk.meeting.dto.requestDto.OpenAiRequestDto;
import com.d208.AIclerk.meeting.dto.response.CommentDeleteResponse;
import com.d208.AIclerk.meeting.dto.response.CreateCommentResponse;
import org.springframework.http.ResponseEntity;

public interface MeetingService {
    ResponseEntity<String> sendText(OpenAiRequestDto dto) throws Exception;

    ResponseEntity<CreateCommentResponse> createComment(CreateCommentRequestDto dto);

    ResponseEntity<CommentDeleteResponse> deleteComment(Long commentId);
}
