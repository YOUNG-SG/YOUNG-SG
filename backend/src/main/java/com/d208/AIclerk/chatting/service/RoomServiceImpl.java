package com.d208.AIclerk.chatting.service;

import com.d208.AIclerk.chatting.dto.requestDto.CreateRecordRequestDTO;
import com.d208.AIclerk.chatting.dto.requestDto.CreateRoomRequestDto;
import com.d208.AIclerk.chatting.util.InviteCodeGenerator;
import com.d208.AIclerk.config.RedisConfig;
import com.d208.AIclerk.entity.MeetingRoom;
import com.d208.AIclerk.chatting.repository.RoomRepository;
import com.d208.AIclerk.entity.Participant;
import com.d208.AIclerk.member.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final InviteCodeGenerator inviteCodeGenerator;
    private final RedisConfig redisConfig;
    private final ParticipantRepository participantRepository;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository, InviteCodeGenerator inviteCodeGenerator, RedisConfig redisConfig, ParticipantRepository participantRepository) {
        this.roomRepository = roomRepository;
        this.inviteCodeGenerator = inviteCodeGenerator;
        this.redisConfig = redisConfig;
        this.participantRepository = participantRepository;
    }

    @Override
    public MeetingRoom createRoom(MeetingRoom room, long ownerId) {
        room.setInviteCode(inviteCodeGenerator.generateInviteCode()); // 초대 코드 생성 및 설정
        MeetingRoom savedRoom = roomRepository.save(room);            // DB에 방 저장
        redisConfig.createRoom(savedRoom.getId(), ownerId);           // Redis에 방 정보 저장

        return savedRoom; // 저장된 방 객체 반환
    }


    public void joinRoom(long roomId, long memberId)
    {
        redisConfig.addRoomMember(roomId, memberId);
    }

    public void startMeeting(long roomId) {
        MeetingRoom room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID: " + roomId));
        room.setStartTime(LocalTime.now());
        roomRepository.save(room);
        redisConfig.startMeeting(roomId);
    }

    public boolean leaveRoom(long roomId, long memberId) {
        redisConfig.leaveRoom(roomId, memberId);
        return true;
    }

    public void endMeeting(long roomId) {
        MeetingRoom room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID: " + roomId));
        room.setEndTime(LocalTime.now());
        roomRepository.save(room);
        redisConfig.endMeeting(roomId);
    }













}


