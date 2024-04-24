package com.d208.AIclerk.meeting.service;

import com.d208.AIclerk.meeting.dto.requestDto.OpenAiApiRequestDto;
import org.springframework.http.ResponseEntity;

public interface MeetingService {
    ResponseEntity<String> sendText(OpenAiApiRequestDto dto) throws Exception;

}
