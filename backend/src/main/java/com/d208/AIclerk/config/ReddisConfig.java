package com.d208.AIclerk.config;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReddisConfig {
    private final StringRedisTemplate redisTemplate;

    @Autowired
    public ReddisConfig(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void createRoom(String roomId, String ownerId, String status) {
        HashOperations<String, String, String> hashOps = redisTemplate.opsForHash();
        hashOps.put("room:" + roomId, "owner", ownerId);
        hashOps.put("room:" + roomId, "status", status);
        redisTemplate.opsForSet().add("room:" + roomId + ":members", ownerId);
    }
}
