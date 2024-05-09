package com.d208.AIclerk.chatting.service;

import com.d208.AIclerk.chatting.dto.responseDto.ChangeOwnerRespnoseDTO;
import com.d208.AIclerk.chatting.util.InviteCodeGenerator;
import com.d208.AIclerk.config.RedisConfig;
import com.d208.AIclerk.entity.MeetingRoom;
import com.d208.AIclerk.chatting.repository.RoomRepository;
import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.entity.Participant;
import com.d208.AIclerk.meeting.dto.response.CreateCommentResponse;
import com.d208.AIclerk.member.repository.MemberRepository;
import com.d208.AIclerk.meeting.repository.ParticipantRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final InviteCodeGenerator inviteCodeGenerator;
    private final RedisConfig redisConfig;
    private final ParticipantRepository participantRepository;
    private final MemberRepository memberRepository;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository, InviteCodeGenerator inviteCodeGenerator, RedisConfig redisConfig, ParticipantRepository participantRepository, MemberRepository memberRepository) {
        this.roomRepository = roomRepository;
        this.inviteCodeGenerator = inviteCodeGenerator;
        this.redisConfig = redisConfig;
        this.participantRepository = participantRepository;
        this.memberRepository = memberRepository;
    }


    @Transactional
    @Override
    public ResponseEntity<ChangeOwnerRespnoseDTO> changeRoomOwner(Long roomId, Long newOwnerId) {
        redisConfig.changeRoomOwner(roomId, newOwnerId);
        ChangeOwnerRespnoseDTO response = new ChangeOwnerRespnoseDTO("반장이변경됬소");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Override
    public MeetingRoom createRoom(MeetingRoom room, long ownerId) {
        room.setInviteCode(inviteCodeGenerator.generateInviteCode()); // 초대 코드 생성 및 설정
        MeetingRoom savedRoom = roomRepository.save(room);            // DB에 방 저장
        redisConfig.createRoom(savedRoom.getId(), ownerId);           // Redis에 방 정보 저장
        return savedRoom; // 저장된 방 객체 반환
    }

    @Override
    public void joinRoom(long roomId, long memberId)
    {
        redisConfig.addRoomMember(roomId, memberId);
    }
//


    @Transactional
    public synchronized  void startMeeting(long roomId) {
        MeetingRoom meetingRoom = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID: " + roomId));
        meetingRoom.setStartTime(LocalDateTime.now());
        roomRepository.save(meetingRoom);
        List<String> memberIds = redisConfig.getRoomMembers(roomId);
        for (String memberIdStr : memberIds) {
            Long memberId = Long.parseLong(memberIdStr);
            Member member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new RuntimeException("Member not found with ID: " + memberId));
            System.out.println("Member ID: " + memberId + ", Meeting Room: " + meetingRoom);

                Participant participant = Participant.builder()
                        .member(member)
                        .meetingRoom(meetingRoom)
                        .build();
                participantRepository.save(participant);
                System.out.println("Saved participant: " + memberId);

        }

        redisConfig.startMeeting(roomId);
    }


    public boolean leaveRoom(long roomId, long memberId) {
        redisConfig.leaveRoom(roomId, memberId);
        return true;
    }

    public void endMeeting(long roomId) {
        MeetingRoom room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID: " + roomId));
        room.setEndTime(LocalDateTime.now());
        roomRepository.save(room);
        redisConfig.endMeeting(roomId);



    }
    @Override
    public void pauseMeeting(Long roomId) {
        redisConfig.pauseMeeting(roomId);
    }


}


