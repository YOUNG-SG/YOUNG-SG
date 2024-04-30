package com.d208.AIclerk.chatting.controller;

import com.d208.AIclerk.chatting.dto.requestDto.*;
import com.d208.AIclerk.chatting.dto.responseDto.CreateRoomResponseDto;
import com.d208.AIclerk.entity.MeetingRoom;
import com.d208.AIclerk.chatting.service.RoomService;
import com.d208.AIclerk.chatting.service.RabbitMqService;
import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.utill.CommonUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/meeting")
@CrossOrigin("*")
@Slf4j
public class RoomController {

    private final RoomService roomService;
    private final RabbitMqService rabbitMqService;
    private final SimpMessagingTemplate messagingTemplate;
    private final CommonUtil commonUtil;

    public RoomController(RoomService roomService, RabbitMqService rabbitMqService, SimpMessagingTemplate messagingTemplate, CommonUtil commonUtil) {
        this.roomService = roomService;
        this.rabbitMqService = rabbitMqService;
        this.messagingTemplate = messagingTemplate;
        this.commonUtil = commonUtil;
    }

    /**
     * 회의생성
     */
    @PostMapping("/create-meeting")
    public ResponseEntity<CreateRoomResponseDto> createRoom(@RequestBody CreateRoomRequestDto dto) {
        long ownerId = commonUtil.getMember().getId();  // 현재 로그인한 사용자의 ID를 가져옴

        MeetingRoom room = new MeetingRoom();           // 새 MeetingRoom 객체 생성
        room.setTitle(dto.getTitle());                  // DTO에서 제목 설정

        MeetingRoom createdRoom = roomService.createRoom(room, ownerId); // 서비스에 room과 ownerId 전달

        // CreateRoomResponseDto 생성하여 반환
        CreateRoomResponseDto response = new CreateRoomResponseDto(
                createdRoom.getInviteCode(),
                0,  // 상태 필드는 여기서 설정합니다. 적절한 상태 코드로 변경해주세요.
                createdRoom.getTitle(),
                "생성햇습니다",
                createdRoom.getId()

        );

        return ResponseEntity.ok(response);
    }



    /**
     * endpoint: ws://localhost:8000/ws
     * /pub/{roomid}/sendMessage  메시지를 보내기
     * /sub/chat/123  //방구독하기 입장임 ( 소켓개념)
     * 보내야할 형식 MessageDto
     */
    @MessageMapping("/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable Long roomId, MessageDto message) {
        Member currentMember = commonUtil.getMember();
        String profile = currentMember.getImage();
        String nickname = currentMember.getNickname();

        message.setSender(nickname);
        message.setProfile(profile);
        message.setSent_time(LocalTime.now());
        log.info("chat {} send by {} to room number {}", message, nickname, roomId);
        messagingTemplate.convertAndSend("/sub/chat/" + roomId, message);
        // rabbitMqService.sendMessage(roomId, message);
    }



    @PostMapping("/join/{roomId}")
    public ResponseEntity<String> joinRoom(@PathVariable Long roomId) {
        long userId=commonUtil.getMember().getId();
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
        Member currentMember = commonUtil.getMember();
        String nickname = currentMember.getNickname();
        long userId = currentMember.getId();

        boolean result = roomService.leaveRoom(request.getRoomId(), userId);
        if (result) {
            return ResponseEntity.ok(nickname + "님이 퇴장하셨습니다.");
        } else {
            return ResponseEntity.badRequest().body(nickname + "님 퇴장에 실패했습니다.");
        }
    }



}

