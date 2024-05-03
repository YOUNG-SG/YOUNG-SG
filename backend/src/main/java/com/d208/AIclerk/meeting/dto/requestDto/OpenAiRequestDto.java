package com.d208.AIclerk.meeting.dto.requestDto;

import lombok.Data;

@Data
public class OpenAiRequestDto {
    private String text;

    private Long roomId;
}
