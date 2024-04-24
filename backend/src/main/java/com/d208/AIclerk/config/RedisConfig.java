package com.d208.AIclerk.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RedisConfig {
    private final StringRedisTemplate redisTemplate;
    private final HashOperations<String, String, Object> hashOperations;
    private final ListOperations<String, String> listOperations;

    @Autowired
    public RedisConfig(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.hashOperations = redisTemplate.opsForHash();
        this.listOperations = redisTemplate.opsForList();
    }

    /**
     * 채팅방 생성 및 초기 정보 설정
     */
    public void createRoom(String roomId, String owner) {
        Map<String, Object> roomInfo = new HashMap<>();
        roomInfo.put("owner", owner);
        roomInfo.put("status", 0);  //  0 - 활성, 1 - 회의중, 2 - 비활성 (안쓸듯)
        hashOperations.putAll("room:" + roomId, roomInfo);
        listOperations.rightPush("room:" + roomId + ":members", owner);
    }



    /**
     * 채팅방 멤버 추가
     */
    public void addRoomMember(String roomId, String member) {
        listOperations.rightPush("room:" + roomId + ":members", member);
    }


    /**
     * 채팅방 정보 업데이트 (방장 변경 또는 상태 변경) //방장이 알아서 나가쇼, 회의시작
     */
    public void leaveRoom(String roomId, String memberId) {
        /*방장이 나가쇼 */
        String currentOwner = (String) hashOperations.get("room:" + roomId, "owner");
        if (memberId.equals(currentOwner)) {
            /* 아무나 방장이 되는거임 */
            List<String> members = listOperations.range("room:" + roomId + ":members", 0, -1);
            members.remove(memberId);
            if (!members.isEmpty()) {
                Collections.shuffle(members);
                String newOwner = members.get(0);
                hashOperations.put("room:" + roomId, "owner", newOwner);
                listOperations.remove("room:" + roomId + ":members", 0, memberId);
            } else {
                /*유저없으면 방 삭제임*/
                deleteRoom(roomId);
            }
        } else {
            // 방장아니면 그냥 리스트에서 삭제
            listOperations.remove("room:" + roomId + ":members", 0, memberId);
        }
    }

    public void deleteRoom(String roomId) {
        redisTemplate.delete("room:" + roomId);
        redisTemplate.delete("room:" + roomId + ":members");
    }


    public void startMeeting(String roomId) {
        hashOperations.put("room:" + roomId, "status", 1); // Set room status to in meeting
    }

    public void endMeeting(String roomId) {
        hashOperations.put("room:" + roomId, "status", 2); // Set room status to inactive
        // Other logic to manage the meeting ending, e.g., storing end time in MySQL could be triggered here
    }


}
