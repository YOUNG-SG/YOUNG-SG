package com.d208.AIclerk.chatting.service;

import com.d208.AIclerk.entity.MeetingRoom;

public interface RoomService {
    MeetingRoom createRoom(MeetingRoom room, String ownerId);
}
