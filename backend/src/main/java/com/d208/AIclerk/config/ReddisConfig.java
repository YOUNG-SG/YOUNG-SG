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

    /**
     * Hashes
     * Key: room:1234
     * Value: {owner: "user1", status: 0}
     * Sets
     * Key: room:1234:members
     * Value: ["user1", "users2",members...]
     * 이런식으로 저장 예정
     */


    public void createRoom(String roomId, String ownerId, String status) {
        HashOperations<String, String, String> hashOps = redisTemplate.opsForHash();
        hashOps.put("room:" + roomId, "owner", ownerId);
        hashOps.put("room:" + roomId, "status", status);
        redisTemplate.opsForSet().add("room:" + roomId + ":members", ownerId);
    }

    public  void joinRoom(String roomId, String memberId){
        redisTemplate.opsForSet().add("room:" + roomId + ":members", memberId);
    }

    /**
     *
     * 참여자 (갱신) , 방장변경( 조건부갱신)
     *
     **/
    public void leftUser(String memberId){

    }



    /**
     *
     * 해당하는 방 관련된 내용들 전부 제거
     *
     **/
    public void leftRoom(String roomId){

//        redisTemplate.opsForHash().get("room"

    }


}
