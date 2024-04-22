package com.d208.AIclerk.chatting.service;

import com.d208.AIclerk.chatting.dto.requestDto.MessageDto;
import org.springframework.http.ResponseEntity;

public interface RabbitMqService {
    ResponseEntity<String> sendMessage(MessageDto messageDto);
    void receiveMessage(MessageDto messageDto);
}