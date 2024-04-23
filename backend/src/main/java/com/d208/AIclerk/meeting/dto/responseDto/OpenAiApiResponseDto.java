package com.d208.AIclerk.meeting.dto.responseDto;

import lombok.Data;

@Data
public class OpenAiApiResponseDto {
    private String title; // 요약된 텍스트의 제목
    private String summary; // 요약된 텍스트 내용

}
