package com.d208.AIclerk.chatting.controller;

import com.d208.AIclerk.chatting.dto.requestDto.*;
import com.d208.AIclerk.chatting.dto.responseDto.ChangeOwnerRespnoseDTO;
import com.d208.AIclerk.chatting.dto.responseDto.CreateRoomResponseDto;
import com.d208.AIclerk.chatting.dto.responseDto.ResnposeRoomIdDTO;
import com.d208.AIclerk.chatting.repository.RoomRepository;
import com.d208.AIclerk.config.RedisConfig;
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
import org.w3c.dom.html.HTMLHeadElement;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/meeting")
@CrossOrigin("*")
@Slf4j
public class RoomController {

    private final RoomService roomService;
    private final RabbitMqService rabbitMqService;
    private final SimpMessagingTemplate messagingTemplate;
    private final CommonUtil commonUtil;
    private final RoomRepository roomRepository;
    private final RedisConfig redisConfig;

    /**
     * 회의생성
     */
    @PostMapping("/create-meeting")
    public ResponseEntity<CreateRoomResponseDto> createRoom(@RequestBody CreateRoomRequestDto dto) {
        long ownerId = commonUtil.getMember().getId();
        String profile = commonUtil.getMember().getImage();
        String nickname = commonUtil.getMember().getNickname();
        MeetingRoom room = new MeetingRoom();
        room.setTitle(dto.getTitle());
        MeetingRoom createdRoom = roomService.createRoom(room, ownerId);
        CreateRoomResponseDto response = new CreateRoomResponseDto(
                createdRoom.getInviteCode(),
                createdRoom.getId(),
                nickname,
                profile,
                java.time.LocalDateTime.now(),
                ownerId
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
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        String formattedTime = now.format(formatter); // 현재 시간을 "HH:mm" 형식으로 포맷팅
        message.setSent_time(formattedTime);
        log.info("Received message from {} ({}): {}", message.getSender(), message.getSenderId(), message.getContent());
        messagingTemplate.convertAndSend("/sub/chat/" + roomId, message);
        // rabbitMqService.sendMessage(roomId, message);
    }
    /**
     *
     * STT매새지기록
     *
     * **/

    @MessageMapping("/{roomId}/sendMeetingChat")
    public void sendMeetingChat(@DestinationVariable Long roomId, MessageDto message) {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        String formattedTime = now.format(formatter); // 현재 시간을 "HH:mm" 형식으로 포맷팅
        message.setSent_time(formattedTime);
        log.info("Received meeting chat from {} ({}): {}", message.getSender(), message.getSenderId(), message.getContent());
        messagingTemplate.convertAndSend("/sub/meetingChat/" + roomId, message); //다른 사용자에게 보내기
        String logMessage = message.getSender() + ": " + message.getContent();
        redisConfig.recordMessage(roomId,logMessage);
    }



    @PostMapping("/get-room-id")
    public ResponseEntity<ResnposeRoomIdDTO> getRoomIdByInviteCode(@RequestBody RequestRoomIdDTO requestDto) {
        Optional<MeetingRoom> roomOptional = roomRepository.findByInviteCode(requestDto.getCode());
        if (roomOptional.isPresent()) {
            return ResponseEntity.ok(new ResnposeRoomIdDTO(roomOptional.get().getId()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }




    @PostMapping("/pause/{roomId}")
    public ResponseEntity<String> pauseMeeting(@PathVariable Long roomId) {
        try {
            roomService.pauseMeeting(roomId);
            return ResponseEntity.ok("미팅이 일시 정지되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("미팅 일시 정지에 실패했습니다: " + e.getMessage());
        }
    }



    @PostMapping("/join/{roomId}")
    public ResponseEntity<MessageDto> joinRoom(@PathVariable Long roomId) {
        Member currentMember = commonUtil.getMember();
        long userId= currentMember.getId();
        String profile = currentMember.getImage();
        String nickname = currentMember.getNickname();
        long memberid = currentMember.getId();

        MessageDto message = new MessageDto();
        message.setSender(nickname);
        message.setProfile(profile);
        message.setSenderId(memberid);

        roomService.joinRoom(roomId, userId);

        return ResponseEntity.ok(message);
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

    @PostMapping("/change-owner")
    public ResponseEntity<ChangeOwnerRespnoseDTO> changeRoomOwner(@RequestBody ChangeOwnerDTO request) {
            return roomService.changeRoomOwner(request.getRoomid(), request.getOwnerid());

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

