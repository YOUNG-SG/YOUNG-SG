package com.d208.AIclerk.chatting.controller;

import com.d208.AIclerk.chatting.dto.requestDto.MessageDto;
import com.d208.AIclerk.chatting.service.RabbitMqService;
import com.d208.AIclerk.entity.MeetingRoom;
import com.d208.AIclerk.chatting.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;
    private final RabbitMqService rabbitMqService;

    public RoomController(RoomService roomService, RabbitMqService rabbitMqService) {
        this.roomService = roomService;
        this.rabbitMqService = rabbitMqService;
    }

    @PostMapping
    public ResponseEntity<MeetingRoom> createRoom(@RequestBody MeetingRoom room, @RequestParam String ownerId) {
        MeetingRoom createdRoom = roomService.createRoom(room, ownerId);
        return ResponseEntity.ok(createdRoom);
    }

    @MessageMapping("/chat/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable String roomId, MessageDto message) {
        rabbitMqService.sendMessage(roomId, message);
    }
}

