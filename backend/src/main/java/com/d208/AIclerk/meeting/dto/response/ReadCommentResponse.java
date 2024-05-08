package com.d208.AIclerk.meeting.dto.response;

import com.d208.AIclerk.meeting.dto.responseDto.CommentResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ReadCommentResponse {

    private String message;

    private List<CommentResponseDto> data;

    private Long currentMemberId;
}
