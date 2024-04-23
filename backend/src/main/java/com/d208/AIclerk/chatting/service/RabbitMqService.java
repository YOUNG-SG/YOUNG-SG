package com.d208.AIclerk.chatting.service;

import com.d208.AIclerk.chatting.dto.requestDto.MessageDto;

public interface RabbitMqService {
    void sendMessage(String roomId, MessageDto messageDto);
//    void receiveMessage(MessageDto messageDto);
}