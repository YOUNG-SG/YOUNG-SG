package com.d208.AIclerk.chatting.controller;

import com.d208.AIclerk.chatting.dto.requestDto.CreateRecordRequestDTO;
import com.d208.AIclerk.chatting.dto.requestDto.EndMeetingRequestDTO;
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

    /**
     * 회의생성
     */
    @PostMapping("/api/main/create-meeting ")
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


    @PostMapping("/api/meeting/join/{roomId}")
    public ResponseEntity<String> joinRoom(@PathVariable String roomId, @RequestParam String userId) {
        roomService.joinRoom(roomId, userId);
        return ResponseEntity.ok("방참여완료...");
    }

    @PostMapping("/api/meeting/record/create")
    public ResponseEntity<String> startMeeting(@RequestBody CreateRecordRequestDTO request) {
        roomService.startMeeting(request.getRoomId());
        return ResponseEntity.ok("미팅시작.,..");
    }

    /**
    미팅종료되면 로직이 필요함- > 미팅이 종료되면 생성된 word파일을 유저이메일에게 s3업로드 s3다운로드 각각 보내는 작업이필요
    */
    @PostMapping("/api/meeting/record/end")
    public ResponseEntity<String> endMeeting(@RequestBody String roomId) {
        roomService.endMeeting(roomId);
        return ResponseEntity.ok("미팅종료...");
    }

    @PostMapping("/api/meeting/leave")
    public ResponseEntity<String> exitMeeting(@RequestBody EndMeetingRequestDTO request) {
        boolean result = roomService.leaveRoom(request.getTitle(), request.getUserId());
        if (result) {
            return ResponseEntity.ok("잘가쇼.");
        } else {
            return ResponseEntity.badRequest().body("방나가기 실패했쇼.");
        }
    }


}

