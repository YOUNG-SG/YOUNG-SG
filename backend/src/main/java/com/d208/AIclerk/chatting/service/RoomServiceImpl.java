package com.d208.AIclerk.chatting.service;

import com.d208.AIclerk.chatting.util.InviteCodeGenerator;
import com.d208.AIclerk.entity.MeetingRoom;
import com.d208.AIclerk.chatting.repository.MeetingRoomRepository;
import com.d208.AIclerk.config.ReddisConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalTime;

@Service
public class RoomServiceImpl implements RoomService {

    private final MeetingRoomRepository meetingRoomRepository;
    private final ReddisConfig redisService;
    private final InviteCodeGenerator inviteCodeGenerator;

    @Autowired
    public RoomServiceImpl(MeetingRoomRepository meetingRoomRepository,
                           ReddisConfig redisService,
                           InviteCodeGenerator inviteCodeGenerator) {

        this.meetingRoomRepository = meetingRoomRepository;
        this.redisService = redisService;
        this.inviteCodeGenerator = inviteCodeGenerator;
    }


    @Override
    public MeetingRoom createRoom(MeetingRoom room, String ownerId) {
        //방생성 로직
        String inviteCode = inviteCodeGenerator.generateInviteCode();
        room.setInviteCode(inviteCode);
        // Save room in MySQL
        MeetingRoom savedRoom = meetingRoomRepository.save(room);
        // Redis에 참여자, 방장 상태 임시로 저장
        redisService.createRoom(savedRoom.getTitle(), ownerId, "0");
        // 해당 룸에 대하여 Routing Key를 설정
        return savedRoom;
    }


    // 방 접속, Redis에 참여자 정보 추가
    public void joinRoom(String roomId, String memberId) {
        redisService.joinRoom(roomId, memberId);
    }

    public void startMeeting() {
        // Meeting start logic
    }

    public void leaveRoom() {
        // Leave room logic
    }

    public void exitMeeting() {
        // Exit meeting logic
    }
}
