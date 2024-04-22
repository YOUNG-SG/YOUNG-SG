package com.d208.AIclerk.chatting.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RoomRedisService {
    private final StringRedisTemplate redisTemplate;

    public RoomRedisService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    public void createRoom(String roomId, String ownerId) {
        String key = "room:" + roomId;
        redisTemplate.opsForHash().put(key, "owner", ownerId);
        redisTemplate.opsForHash().put(key, "status", "active");
        redisTemplate.opsForSet().add(key + ":members", ownerId);
    }
}
