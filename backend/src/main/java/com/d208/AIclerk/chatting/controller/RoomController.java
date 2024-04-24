package com.d208.AIclerk.chatting.controller;

import com.d208.AIclerk.chatting.dto.requestDto.MessageDto;
import com.d208.AIclerk.chatting.service.RabbitMqService;
import com.d208.AIclerk.entity.MeetingRoom;
import com.d208.AIclerk.chatting.service.RoomService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
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

    //방생성할대 Que만들필요없어
    @PostMapping
    public ResponseEntity<MeetingRoom> createRoom(@RequestBody MeetingRoom room, @RequestParam String ownerId) {
        //방장 닉네임을 받아오고
        MeetingRoom createdRoom = roomService.createRoom(room,ownerId);
        return ResponseEntity.ok(createdRoom);
    }

    //방나가기 (redis에서 방장인지 아닌지 체크후 나간사람이 방장이면 참여자목록중에 random유저한테 방장을 넘겨주기



    //채팅보내기
    @MessageMapping("/chat/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable String roomId, MessageDto message) {
        rabbitMqService.sendMessage(roomId, message);
    }


    // 추가로 구현할 기능들 (회의 시작, 회의 종료, 방 나가기 등)

    // 회의 시작: 채팅 기록과 웹소켓 활성화 로직 구현 필요
    // 회의 종료: 녹화 종료와 관련 데이터 처리 로직 구현 필요
    // 방 나가기: Redis에서 방장 체크 후 처리 로직 구현 필요





}

