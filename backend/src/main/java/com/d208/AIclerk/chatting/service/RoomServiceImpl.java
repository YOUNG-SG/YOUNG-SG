    package com.d208.AIclerk.chatting.service;

    import com.d208.AIclerk.chatting.util.InviteCodeGenerator;
    import com.d208.AIclerk.config.RedisConfig;
    import com.d208.AIclerk.entity.MeetingRoom;
    import com.d208.AIclerk.chatting.repository.RoomRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import java.time.LocalTime;

    @Service
    public class RoomServiceImpl implements RoomService {

        private final RoomRepository roomRepository;
        private final InviteCodeGenerator inviteCodeGenerator;
        private final RedisConfig redisConfig;

        @Autowired
        public RoomServiceImpl(RoomRepository RoomRepository, InviteCodeGenerator inviteCodeGenerator, RedisConfig redisConfig) {
            this.roomRepository = RoomRepository;
            this.inviteCodeGenerator = inviteCodeGenerator;
            this.redisConfig = redisConfig;
        }
        /**
         * 새로운 회의방을 생성하고 데이터베이스에 저장
         * @param room 회의방 정보
         * @param ownerId 방장의 식별자
         * @return 저장된 회의방 객체
         */

        @Override
        public MeetingRoom createRoom(MeetingRoom room, String ownerId) {
            room.setInviteCode(inviteCodeGenerator.generateInviteCode());
            MeetingRoom savedRoom = roomRepository.save(room);
            redisConfig.createRoom(savedRoom.getId().toString(), ownerId);
            return savedRoom;
        }


        /**
         * 회의방에 사용자를 추가
         * @param roomId 회의방 식별자
         * @param memberId 참여자의 식별자
         */
        public void joinRoom(String roomId, String memberId) {
            redisConfig.addRoomMember(roomId, memberId);
        }

        /**
         * 회의 시작 로직 구현
         */
        public void startMeeting(String roomId) {
            MeetingRoom room = roomRepository.findById(Long.parseLong(roomId))
                    .orElseThrow(() -> new IllegalArgumentException("예외처리방 ID: " + roomId));
            room.setStartTime(LocalTime.now());
            roomRepository.save(room);
            redisConfig.startMeeting(roomId);
        }

        /**
         * 회의방에서 사용자가 나갈 때 처리 로직
         *
         * @param roomId   회의방 식별자
         * @param memberId 나가려는 사용자의 식별자
         */
        public boolean leaveRoom(String roomId, Long memberId) {
            redisConfig.leaveRoom(roomId, memberId);
            return true;
        }
        /**
         * 회의 종료 로직
         * @param roomId 종료할 회의방의 식별자
         */
        public void endMeeting(String roomId) {
            MeetingRoom room = roomRepository.findById(Long.parseLong(roomId))
                    .orElseThrow(() -> new IllegalArgumentException("예외처리방 ID: " + roomId));
            room.setEndTime(LocalTime.now());
            roomRepository.save(room);
            redisConfig.endMeeting(roomId);
        }
    }
