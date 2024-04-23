package com.d208.AIclerk.utill;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class OpenAiUtil {

    @Value("${open-ai.url}")
    private String OPENAI_API_URL;

    @Value("${open-ai.secret-key}")
    private String API_KEY;
    public String summarizeText(String inputText) throws Exception{

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + API_KEY);

        // 텍스트 요약 및 제목 생성 요청 형식으로 페이로드 구성
        String payload = String.format("{\"model\": \"gpt-3.5-turbo\", " +
                "\"messages\": [{ " +
                "\"role\": \"user\", " +
                "\"content\": \"내용요약 해줘 : %s\" " +
                "}], " +
                "\"max_tokens\": 1000}", inputText);

        HttpEntity<String> request = new HttpEntity<>(payload, headers);
        RestTemplate restTemplate = new RestTemplate();

        String response = restTemplate.postForObject(OPENAI_API_URL, request, String.class);

        log.info("(OpenAiUtil) {}", response);
        // JSON 응답에서 "content" 필드 추출
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(response);
        JsonNode contentNode = rootNode.path("choices").get(0).path("message").path("content");

//        String[] parts = contentNode.asText().split("\r?\n+");
//        Map<String, String> resultMap = new HashMap<>();
//        resultMap.put("title", parts[0]); // 첫 번째 줄을 제목으로 가정
//        resultMap.put("content", parts[1]); // 두 번째 줄을 주제로 가정
//
//        log.info("(내용) {}", resultMap.put("content", parts[1]));
//        log.info("(제목) {}", resultMap.put("title", parts[0]));

        return contentNode.asText();
    }

}
