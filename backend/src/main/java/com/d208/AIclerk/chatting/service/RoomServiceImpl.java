package com.d208.AIclerk.chatting.service;

import com.d208.AIclerk.entity.MeetingRoom;
import com.d208.AIclerk.chatting.repository.MeetingRoomRepository;
import com.d208.AIclerk.config.RabbitMQConfig;
import com.d208.AIclerk.config.ReddisConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomServiceImpl implements RoomService {
    @Autowired
    private MeetingRoomRepository meetingRoomRepository;
    @Autowired
    private RabbitMQConfig rabbitMQConfig;
    @Autowired
    private ReddisConfig redisService;

    @Override
    public MeetingRoom createRoom(MeetingRoom room, String ownerId) {
        // Save room in MySQL
        MeetingRoom savedRoom = meetingRoomRepository.save(room);
        // Create room in Redis with initial status and add owner as a member
        redisService.createRoom(savedRoom.getId().toString(), ownerId, "0");
        // Configure RabbitMQ queue and binding using the room's title as routing key
        rabbitMQConfig.configureQueueForRoom(savedRoom.getId().toString());
        return savedRoom;
    }
}
