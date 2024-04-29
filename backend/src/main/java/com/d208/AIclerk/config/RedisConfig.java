package com.d208.AIclerk.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
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

    public void createRoom(Long roomId, Long owner) {
        String roomKey = "room:" + roomId.toString();  // roomId를 String으로 변환
        Map<String, Object> roomInfo = new HashMap<>();
        roomInfo.put("owner", owner.toString());  // owner를 String으로 변환
        roomInfo.put("status", "0");
        hashOperations.putAll(roomKey, roomInfo);
        listOperations.rightPush(roomKey + ":members", owner.toString());  // owner를 String으로 변환

    }


    public void addRoomMember(long roomId, long member) {
        listOperations.rightPush("room:" + roomId + ":members", String.valueOf(member));
    }

    public void leaveRoom(Long roomId, Long memberId) {
        String roomKey = "room:" + roomId;
        String currentOwner = (String) hashOperations.get(roomKey, "owner");
        if (currentOwner.equals(memberId.toString())) {
            List<String> members = listOperations.range(roomKey + ":members", 0, -1);
            if (members != null) {
                members.remove(memberId.toString());
                if (!members.isEmpty()) {
                    Collections.shuffle(members);
                    String newOwner = members.get(0);
                    hashOperations.put(roomKey, "owner", newOwner);
                    listOperations.remove(roomKey + ":members", 0, memberId.toString());
                } else {
                    deleteRoom(roomId);
                }
            }
        } else {
            listOperations.remove(roomKey + ":members", 0, memberId.toString());
        }
    }

    public void deleteRoom(Long roomId) {
        redisTemplate.delete("room:" + roomId);
        redisTemplate.delete("room:" + roomId + ":members");
    }

    public void startMeeting(Long roomId) {
        String roomKey = "room:" + roomId.toString();
        hashOperations.put(roomKey, "status", "1");
    }


    public void endMeeting(Long roomId) {
        hashOperations.put("room:" + roomId, "status", 2);
    }
}
