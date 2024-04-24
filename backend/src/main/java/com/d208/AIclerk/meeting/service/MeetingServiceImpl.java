package com.d208.AIclerk.meeting.service;


import com.d208.AIclerk.entity.MeetingDetail;
import com.d208.AIclerk.meeting.dto.requestDto.OpenAiApiRequestDto;
import com.d208.AIclerk.meeting.repository.MeetingDetailRepository;
import com.d208.AIclerk.utill.OpenAiUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MeetingServiceImpl implements MeetingService {

    private final OpenAiUtil openAiUtil;

    private final MeetingDetailRepository meetingDetailRepository;

    @Override
    public ResponseEntity<String> sendText(OpenAiApiRequestDto dto) throws Exception {

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

}
