package com.d208.AIclerk.config;

import com.d208.AIclerk.chatting.repository.RoomRepository;
import com.d208.AIclerk.chatting.repository.SummaryRepository;
import com.d208.AIclerk.chatting.util.RedisSubscriber;
import com.d208.AIclerk.entity.MeetingDetail;
import com.d208.AIclerk.entity.MeetingRoom;
import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.entity.Summary;
import com.d208.AIclerk.meeting.repository.MeetingDetailRepository;
import com.d208.AIclerk.member.exception.MemberNotFoundException;
import com.d208.AIclerk.member.repository.MemberRepository;
import com.d208.AIclerk.meeting.repository.ParticipantRepository;
import com.d208.AIclerk.utill.CommonUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class RedisConfig {
    private final StringRedisTemplate redisTemplate;
    private final HashOperations<String, String, Object> hashOperations;
    private final ListOperations<String, String> listOperations;
    private final RedisSubscriber redisSubscriber;  // RedisSubscriber 주입
    private final SimpMessagingTemplate messagingTemplate;
    private  final MemberRepository memberRepository;
    private final MeetingDetailRepository meetingDetailRepository;
    private final SummaryRepository summaryRepository;

    private final RoomRepository roomRepository;

    @Autowired
    public RedisConfig(StringRedisTemplate redisTemplate, RedisSubscriber redisSubscriber, SimpMessagingTemplate messagingTemplate, CommonUtil commonUtil, MemberRepository memberRepository, ParticipantRepository participantRepository, MeetingDetailRepository meetingDetailRepository, SummaryRepository summaryRepository, RoomRepository roomRepository) {
        this.redisTemplate = redisTemplate;
        this.hashOperations = redisTemplate.opsForHash();
        this.listOperations = redisTemplate.opsForList();
        this.redisSubscriber = redisSubscriber;
        this.messagingTemplate = messagingTemplate;
        this.memberRepository = memberRepository;
        this.meetingDetailRepository = meetingDetailRepository;
        this.summaryRepository = summaryRepository;
        this.roomRepository = roomRepository;
    }

    public void createRoom(Long roomId, Long owner) {
        System.out.println("방만드는거 시작할게 ㅎㅎ;;");
        String roomKey = "room:" + roomId.toString();
        Map<String, Object> roomInfo = new HashMap<>();
        System.out.println(owner.toString());
        roomInfo.put("owner", owner.toString());
        roomInfo.put("status", "0");
        hashOperations.putAll(roomKey, roomInfo);
//        listOperations.rightPush(roomKey + ":members", owner.toString());
        System.out.println("방 정보가 Redis에 저장되었습니다: " + roomKey);
    }



    public void changeRoomOwner(long roomId, long newOwnerId) {
        String roomKey = "room:" + roomId;
        hashOperations.put(roomKey, "owner", String.valueOf(newOwnerId));
        updateRoomInfo(roomId);
        String newOwnerNickname = memberRepository.findById(newOwnerId)
                .orElseThrow(() -> new MemberNotFoundException("Member not found for ID: " + newOwnerId))
                .getNickname();
        String changeOwnerMessage = roomId+":"+"방장이 " + newOwnerNickname + "님(으)로 변경되었습니다.";
        messagingTemplate.convertAndSend("/sub/room/update/" + roomId, changeOwnerMessage);
        redisTemplate.convertAndSend("chatRoom:" + roomId, changeOwnerMessage);
    }

    public void updateRoomInfo(long roomId) {
        String roomKey = "room:" + roomId;
        List<String> memberIds = listOperations.range(roomKey + ":members", 0, -1);
        List<Map<String, Object>> memberDetails = new ArrayList<>();

        // owner ID를 가져와서 닉네임도 조회
        String ownerId = (String) hashOperations.get(roomKey, "owner");
        String status = (String) hashOperations.get(roomKey, "status");
        Member owner = memberRepository.findById(Long.parseLong(ownerId))
                .orElseThrow(() -> new MemberNotFoundException("Member not found for ID: " + ownerId));

        for (String memberId : memberIds) {
            Optional<Member> memberOpt = memberRepository.findById(Long.parseLong(memberId));
            if (memberOpt.isPresent()) {
                Member member = memberOpt.get();
                Map<String, Object> details = new HashMap<>();
                details.put("id", member.getId());
                details.put("nickname", member.getNickname());
                details.put("profile", member.getImage());
                memberDetails.add(details);
            }
        }
        Map<String, Object> roomInfo = new HashMap<>();
        roomInfo.put("owner", owner.getNickname()); // owner 닉네임
        roomInfo.put("status", status);
        roomInfo.put("members", memberDetails);
        String message = toJson(roomInfo);
        messagingTemplate.convertAndSend("/sub/room/update/" + roomId, message);

    }



    private String toJson(Object object) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting to JSON", e);
        }
    }



    public void addRoomMember(long roomId, long memberId) {
        String memberKey = "room:" + roomId + ":members";
        List<String> existingMembers = redisTemplate.opsForList().range(memberKey, 0, -1);

        System.out.println(memberId);
        System.out.println(existingMembers+"asdasdasdasdasdasd");

        if (existingMembers.contains(String.valueOf(memberId))) {
            throw new IllegalStateException("회원이 이미 방에 참여했습니다. ID: " + memberId);
        }

        //멤버예외처리
        Member currentMember = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException("404없다 ID: " + memberId));
        String nickname = currentMember.getNickname();

        redisTemplate.opsForList().rightPush(memberKey, String.valueOf(memberId));
        String message = roomId + ":" + nickname + "님이 입장하셨습니다.";
        redisTemplate.convertAndSend("chatRoom:" + roomId, message);
        updateRoomInfo(roomId);
    }

    public void leaveRoom(Long roomId, Long memberId) {
        String roomKey = "room:" + roomId;
        Member currentMember = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException("404없다 ID: " + memberId));
        String nickname = currentMember.getNickname();
        String currentOwner = (String) hashOperations.get(roomKey, "owner");
        System.out.println(currentOwner + "현재방장아이디");

        if (currentOwner.equals(memberId.toString())) {
            List<String> members = listOperations.range(roomKey + ":members", 0, -1);
            members.remove(memberId.toString());
            if (members.isEmpty()) {
                deleteRoom(roomId);
                String message = roomId + ": 방장님이 퇴장하시면서 방이 삭제되었습니다.";
                redisTemplate.convertAndSend("chatRoom:" + roomId, message);
            } else {
                Collections.shuffle(members);
                String newOwner = members.get(0);
                hashOperations.put(roomKey, "owner", newOwner);
                listOperations.remove(roomKey + ":members", 0, memberId.toString());
                String message = roomId + ":" + nickname + " 방장님이 퇴장하셨습니다.";
                redisTemplate.convertAndSend("chatRoom:" + roomId, message);
                updateRoomInfo(roomId);
            }
        } else {
            // Not the owner, just remove from the list
            listOperations.remove(roomKey + ":members", 0, memberId.toString());
            String message = roomId + ":" + nickname + "님이 퇴장하셨습니다.";
            redisTemplate.convertAndSend("chatRoom:" + roomId, message);
            updateRoomInfo(roomId);
        }
    }

    public void deleteRoom(Long roomId) {
        redisTemplate.delete("room:" + roomId);
        redisTemplate.delete("room:" + roomId + ":members");
    }

    public void startMeeting(Long roomId) {
        String roomKey = "room:" + roomId.toString();
        hashOperations.put(roomKey, "status", "1");
        updateRoomInfo(roomId);
        String chatLogKey = "chatlog:" + roomId;
        redisTemplate.delete(chatLogKey); // 기존 로그가 있을 경우 삭제
        String startMessage = "미팅이 시작되었슴니다";
        messagingTemplate.convertAndSend("/sub/meetingChat/" + roomId, startMessage);
//        redisTemplate.opsForList().rightPush(chatLogKey, startMessage);
    }

    public void recordMessage(Long roomId, String message) {
        String chatLogKey = "chatlog:" + roomId;
        redisTemplate.opsForList().rightPush(chatLogKey, message);
    }

    public List<String> getRoomMembers(Long roomId) {
        String key = "room:" + roomId + ":members";
        return redisTemplate.opsForList().range(key, 0, -1);
    }



    public void endMeeting(Long roomId) {
        String roomKey = "room:" + roomId.toString();
        hashOperations.put(roomKey, "status", "2");
        updateRoomInfo(roomId);
        String endMessage = "미팅이 종료되었슴다";
        messagingTemplate.convertAndSend("/sub/meetingChat/" + roomId, endMessage);
        List<String> chatLogs = redisTemplate.opsForList().range("chatlog:" + roomId, 0, -1);
        String summary = String.join(" ", chatLogs); // 모든 로그를 하나의 문자열로 결합
        saveChatLogsToDatabase(roomId, summary); // DB에 저장
        redisTemplate.delete("chatlog:" + roomId); // Redis에서 채팅 로그 삭제
    }

    private void saveChatLogsToDatabase(Long roomId, String summary) {
        MeetingRoom meetingRoom = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID: " + roomId));


        Summary summary1 = Summary.builder()
                .title(meetingRoom.getTitle()) // MeetingRoom에서 제목 가져오기
                .content(summary)
                .create_at(LocalDateTime.now())
                .meetingRoom(meetingRoom)
                .build();

//        MeetingDetail meetingDetail = MeetingDetail.builder()
//                .title(meetingRoom.getTitle()) // MeetingRoom에서 제목 가져오기
//                .content(summary)
//                .create_at(LocalDateTime.now())
//                .meetingRoom(meetingRoom)
//                .build();

        summaryRepository.save(summary1); // 저장
    }


    // 방 상태 및 멤버 수 업데이트 메서드

    public void pauseMeeting(Long roomId) {
        String roomKey = "room:" + roomId.toString();
        hashOperations.put(roomKey, "status", "3");
        updateRoomInfo(roomId);
        String pauseMessage = "미팅이 일시 정지되었습니다.";
        messagingTemplate.convertAndSend("/sub/meetingChat/" + roomId, pauseMessage);

    }






    @Bean
    public RedisMessageListenerContainer container(RedisConnectionFactory connectionFactory) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(redisSubscriber, new PatternTopic("chatRoom:*")); //챗룸에 관한건 모두감지
        return container;
    }

    @Bean
    MessageListenerAdapter listenerAdapter(RedisSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "onMessage");
    }

}
