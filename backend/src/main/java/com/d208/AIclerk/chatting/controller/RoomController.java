package com.d208.AIclerk.chatting.controller;

import com.d208.AIclerk.chatting.dto.requestDto.MessageDto;
import com.d208.AIclerk.entity.MeetingRoom;
import com.d208.AIclerk.chatting.service.RoomService;
import com.d208.AIclerk.chatting.service.RabbitMqService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;
    private final RabbitMqService rabbitMqService;
    private final SimpMessagingTemplate messagingTemplate;

    public RoomController(RoomService roomService, RabbitMqService rabbitMqService, SimpMessagingTemplate messagingTemplate) {
        this.roomService = roomService;
        this.rabbitMqService = rabbitMqService;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping
    public ResponseEntity<MeetingRoom> createRoom(@RequestBody MeetingRoom room, @RequestParam String ownerId) {
        MeetingRoom createdRoom = roomService.createRoom(room, ownerId);
        return ResponseEntity.ok(createdRoom);
    }


    /**
     * 클라이언트는  /sub/chat/{roomId} 구독하고 나서  /pub/chat/{roomId}/sendMessage 주소로 보내기
     */
    @MessageMapping("/chat/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable String roomId, MessageDto message) {
        // 메시지를 해당 방의 모든 구독자에게 브로드캐스트
        messagingTemplate.convertAndSend("/sub/chat/" + roomId, message);
        rabbitMqService.sendMessage(roomId, message);
    }


    @PostMapping("/{roomId}/join")
    public ResponseEntity<String> joinRoom(@PathVariable String roomId, @RequestParam String userId) {
        roomService.joinRoom(roomId, userId);
        return ResponseEntity.ok("방참여완료...");
    }

    @PostMapping("/{roomId}/startMeeting")
    public ResponseEntity<String> startMeeting(@PathVariable String roomId) {
        roomService.startMeeting(roomId);
        return ResponseEntity.ok("미팅시작.,..");
    }

    @PostMapping("/{roomId}/endMeeting")
    public ResponseEntity<String> endMeeting(@PathVariable String roomId) {
        roomService.endMeeting(roomId);
        return ResponseEntity.ok("미팅종료...");
    }

    @PostMapping("/{roomId}/leave")
    public ResponseEntity<String> leaveRoom(@PathVariable String roomId, @RequestParam String userId) {
        roomService.leaveRoom(roomId, userId);
        return ResponseEntity.ok("누간가 나갓슴...");
    }
}

