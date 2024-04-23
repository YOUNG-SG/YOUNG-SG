package com.d208.AIclerk.chatting.service;


import com.d208.AIclerk.chatting.dto.requestDto.MessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class RabbitMqServiceImpl implements RabbitMqService {


    @Value("${spring.rabbitmq.exchange.name}")
    private String exchangeName;


    private final RabbitTemplate rabbitTemplate;


    @Override
    public void sendMessage(String roomId, MessageDto messageDto) {
        try {
            log.info("Message send: {}", messageDto.toString());
            this.rabbitTemplate.convertAndSend(exchangeName, roomId, messageDto); //exchange는 미리 설정해놓고..
            ResponseEntity.ok("Message sent successfully" + roomId);
        } catch (Exception e) {
            log.error("Error sending message: {}", e.getMessage());
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send message");
        }
    }


    /**
     *3
     * 수정바람..! 문제생김  ??
     *
     * */

}
