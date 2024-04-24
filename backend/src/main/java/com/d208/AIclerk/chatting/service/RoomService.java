package com.d208.AIclerk.chatting.service;

import com.d208.AIclerk.entity.MeetingRoom;

public interface RoomService {
    MeetingRoom createRoom(MeetingRoom room, String ownerId);

    void leaveRoom(String roomId, String userId);

    void joinRoom(String roomId, String userId);

    void startMeeting(String roomId);

    void endMeeting(String roomId);
}
