package com.d208.AIclerk.meeting.service;


import com.d208.AIclerk.entity.MeetingDetail;
import com.d208.AIclerk.entity.Summary;
import com.d208.AIclerk.meeting.dto.requestDto.OpenAiApiRequestDto;
import com.d208.AIclerk.meeting.repository.MeetingDetailRepository;
import com.d208.AIclerk.meeting.repository.SummaryRepository;
import com.d208.AIclerk.utill.OpenAiUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MeetingServiceImpl implements MeetingService{

    private final OpenAiUtil openAiUtil;

    private final MeetingDetailRepository meetingDetailRepository;
    private final SummaryRepository summaryRepository;

    @Override
    public ResponseEntity<String> sendText(OpenAiApiRequestDto dto) throws Exception {

        String result = openAiUtil.summarizeText(dto.getText());

        log.info("(MeetingServiceImpl) {}", dto.getText());
        log.info("(MeetingServiceImpl) {}", result);
        MeetingDetail meetingDetail = new MeetingDetail();

        meetingDetail.setSummary(result);

        meetingDetailRepository.save(meetingDetail);

        return ResponseEntity.ok("저장 성공");
    }
}
