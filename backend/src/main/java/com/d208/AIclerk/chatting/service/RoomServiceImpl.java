package com.d208.AIclerk.chatting.service;

import com.d208.AIclerk.chatting.util.InviteCodeGenerator;
import com.d208.AIclerk.config.RedisConfig;
import com.d208.AIclerk.entity.MeetingRoom;
import com.d208.AIclerk.chatting.repository.RoomRepository;
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

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository, InviteCodeGenerator inviteCodeGenerator, RedisConfig redisConfig) {
        this.roomRepository = roomRepository;
        this.inviteCodeGenerator = inviteCodeGenerator;
        this.redisConfig = redisConfig;
    }

    @Override
    public MeetingRoom createRoom(MeetingRoom room, long ownerId) {
        room.setInviteCode(inviteCodeGenerator.generateInviteCode());
        MeetingRoom savedRoom = roomRepository.save(room);
        redisConfig.createRoom(savedRoom.getId(), ownerId);
        return savedRoom;
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


