package com.d208.AIclerk.meeting.service;

import com.d208.AIclerk.meeting.dto.requestDto.CreateCommentRequestDto;
import com.d208.AIclerk.meeting.dto.requestDto.OpenAiRequestDto;
import com.d208.AIclerk.meeting.dto.response.CommentDeleteResponse;
import com.d208.AIclerk.meeting.dto.response.CreateCommentResponse;
import com.d208.AIclerk.meeting.dto.response.MeetingDetailResponse;
import org.springframework.http.ResponseEntity;

public interface MeetingService {
    ResponseEntity<String> summaryText(OpenAiRequestDto dto) throws Exception;

    ResponseEntity<CreateCommentResponse> createComment(CreateCommentRequestDto dto);

    ResponseEntity<CommentDeleteResponse> deleteComment(Long commentId);

    ResponseEntity<MeetingDetailResponse> readMeetingDetail(Long roomId);
}
