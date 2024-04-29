package com.d208.AIclerk.chatting.controller;

import com.d208.AIclerk.chatting.dto.requestDto.CreateRecordRequestDTO;
import com.d208.AIclerk.chatting.dto.requestDto.EndMeetingRequestDTO;
import com.d208.AIclerk.chatting.dto.requestDto.LeaveMeetingRequestDto;
import com.d208.AIclerk.chatting.dto.requestDto.MessageDto;
import com.d208.AIclerk.entity.MeetingRoom;
import com.d208.AIclerk.chatting.service.RoomService;
import com.d208.AIclerk.chatting.service.RabbitMqService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/meeting")
@CrossOrigin("*")
@Slf4j
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
    @PostMapping("/create-meeting ")
    public ResponseEntity<MeetingRoom> createRoom(@RequestBody MeetingRoom room, @RequestParam Long ownerId) {
        MeetingRoom createdRoom = roomService.createRoom(room, ownerId);
        return ResponseEntity.ok(createdRoom);
    }


    /**
     * endpoint: ws://localhost:8000/ws
     * /pub/{roomid}/sendMessage  메시지를 보내기
     * /sub/chat/123  //방구독하기 입장임 ( 소켓개념)
     * 보내야할 형식 MessageDto
     */
    @MessageMapping("/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable Long roomId, MessageDto message) {
        // 메시지를 해당 방의 모든 구독자에게 브로드캐스트
        log.info("chat {} send by {} to room number{}", message,message.getSender(),roomId);
        messagingTemplate.convertAndSend("/sub/chat/" + roomId, message);
//        rabbitMqService.sendMessage(roomId, message);
    }


    @PostMapping("/join/{roomId}")
    public ResponseEntity<String> joinRoom(@PathVariable Long roomId, @RequestParam Long userId) {
        roomService.joinRoom(roomId, userId);
        return ResponseEntity.ok("방참여완료...");
    }


    /**
     미팅시작되면 로직이 필요함- > 미팅이 종료되면 생성된 word파일을 STT
     */
    @PostMapping("/record/start")
    public ResponseEntity<String> startMeeting(@RequestBody CreateRecordRequestDTO request) {
        roomService.startMeeting(request.getRoomId());
        return ResponseEntity.ok("미팅시작.,..");
    }

    /**
    미팅종료되면 로직이 필요함- > 미팅이 종료되면 생성된 word파일을 유저이메일에게 s3업로드 s3다운로드 각각 보내는 작업이필요
    */
    @PostMapping("/record/end")
    public ResponseEntity<String> endMeeting(@RequestBody EndMeetingRequestDTO request) {
        roomService.endMeeting(request.getRoomId());
        return ResponseEntity.ok("미팅종료...");
    }

    @PostMapping("/leave")
    public ResponseEntity<String> exitMeeting(@RequestBody LeaveMeetingRequestDto request) {
        boolean result = roomService.leaveRoom(request.getRoomId(), request.getUserId());
        if (result) {
            return ResponseEntity.ok("잘가쇼.");
        } else {
            return ResponseEntity.badRequest().body("방나가기 실패했쇼.");
        }
    }


}

