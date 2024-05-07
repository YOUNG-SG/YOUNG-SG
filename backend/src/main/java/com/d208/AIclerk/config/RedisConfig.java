package com.d208.AIclerk.config;

import com.d208.AIclerk.chatting.util.RedisSubscriber;
import com.d208.AIclerk.entity.Member;
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
import java.util.*;

@Service
public class RedisConfig {
    private final StringRedisTemplate redisTemplate;
    private final HashOperations<String, String, Object> hashOperations;
    private final ListOperations<String, String> listOperations;
    private final RedisSubscriber redisSubscriber;  // RedisSubscriber 주입
    private final SimpMessagingTemplate messagingTemplate;
    private final CommonUtil commonUtil;
    private  final MemberRepository memberRepository;
    private final ParticipantRepository participantRepository;

    @Autowired
    public RedisConfig(StringRedisTemplate redisTemplate, RedisSubscriber redisSubscriber, SimpMessagingTemplate messagingTemplate, CommonUtil commonUtil, MemberRepository memberRepository, ParticipantRepository participantRepository) {
        this.redisTemplate = redisTemplate;
        this.hashOperations = redisTemplate.opsForHash();
        this.listOperations = redisTemplate.opsForList();
        this.redisSubscriber = redisSubscriber;
        this.messagingTemplate = messagingTemplate;
        this.commonUtil = commonUtil;
        this.memberRepository = memberRepository;
        this.participantRepository = participantRepository;
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

    public void updateRoomInfo(long roomId) {
        String roomKey = "room:" + roomId;
        String status = (String) hashOperations.get(roomKey, "status");
        List<String> memberIds = listOperations.range(roomKey + ":members", 0, -1);
        String ownerId = (String) hashOperations.get(roomKey, "owner");
        List<String> memberNicknames = new ArrayList<>();


        System.out.print(memberIds+"zzdasdasd");
        //멤버목록이니라
        assert memberIds != null;
        for (String memberId : memberIds) {
            Member member = memberRepository.findById(Long.parseLong(memberId))
                    .orElseThrow(() -> new MemberNotFoundException("Member not found ID: " + memberId));
            memberNicknames.add(member.getNickname());
        }

        //어이 방장닉이니라
        Member owner = memberRepository.findById(Long.parseLong(ownerId))
                .orElseThrow(() -> new MemberNotFoundException("Owner not found ID: " + ownerId));
        String ownerNickname = owner.getNickname();

        Map<String, Object> updateInfo = new HashMap<>();
        updateInfo.put("status", status);
        updateInfo.put("members", memberNicknames);
        updateInfo.put("owner", ownerNickname);

        ObjectMapper mapper = new ObjectMapper();
        try {
            String message = mapper.writeValueAsString(updateInfo);
            messagingTemplate.convertAndSend("/sub/room/update/" + roomId, message);
//        redisTemplate.convertAndSend("roomUpdates:" + roomId, message); // For debugging

        } catch (JsonProcessingException e) {
            e.printStackTrace();
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
    }



    public List<String> getRoomMembers(Long roomId) {
        String key = "room:" + roomId + ":members";
        return redisTemplate.opsForList().range(key, 0, -1);
    }



    public void endMeeting(Long roomId) {
        hashOperations.put("room:" + roomId, "status", "2");
        updateRoomInfo(roomId);
    }


    // RedisConfig.java 내부에 채팅 로그 관리를 위한 메서드 추가
    public void appendChatLog(Long roomId, String message) {
        String key = "chatlog:" + roomId;
        redisTemplate.opsForList().rightPush(key, message);
    }




    // 방 상태 및 멤버 수 업데이트 메서드



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
