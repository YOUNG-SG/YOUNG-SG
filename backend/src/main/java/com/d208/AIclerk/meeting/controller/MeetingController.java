package com.d208.AIclerk.meeting.controller;

import com.d208.AIclerk.meeting.dto.requestDto.OpenAiApiRequestDto;
import com.d208.AIclerk.meeting.dto.responseDto.OpenAiApiResponseDto;
import com.d208.AIclerk.meeting.service.MeetingService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/meeting")
@Slf4j
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping("/send-text")
    @Operation(summary = "텍스트 요약", description = "텍스트 요약 후 db에 저장")
    public ResponseEntity<String> sendText(@RequestBody OpenAiApiRequestDto dto) throws Exception {

        return meetingService.sendText(dto);

    }
}
