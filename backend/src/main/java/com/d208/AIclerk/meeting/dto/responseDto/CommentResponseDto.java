package com.d208.AIclerk.meeting.dto.responseDto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor @NoArgsConstructor
public class CommentResponseDto {

    private Long commentId;

    private Long userId;

    private String nickname;

    private String profileUrl;

    private String content;

    private LocalDateTime createAt;

}
