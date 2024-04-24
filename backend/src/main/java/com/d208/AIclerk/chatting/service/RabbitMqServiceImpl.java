package com.d208.AIclerk.chatting.service;

import com.d208.AIclerk.chatting.dto.requestDto.MessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class RabbitMqServiceImpl implements RabbitMqService {

    @Value("${spring.rabbitmq.exchange.name}")
    private String exchangeName;
    private final RabbitTemplate rabbitTemplate;
    private final SimpMessagingTemplate messagingTemplate; // 웹소켓 메시징 템플릿
    @Override
    public void sendMessage(String roomId, MessageDto messageDto) {
        log.info("Sending message to room {}: {}", roomId, messageDto);
        rabbitTemplate.convertAndSend(exchangeName, roomId, messageDto);
    }

    @Override
    public void broadcastMessage(String roomId, MessageDto messageDto) {
        log.info("Broadcasting message to room {}: {}", roomId, messageDto);
        messagingTemplate.convertAndSend("/sub/chat/" + roomId, messageDto);
    }
}
