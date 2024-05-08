package com.d208.AIclerk.chatting.service;

import com.d208.AIclerk.entity.MeetingRoom;

public interface RoomService {

    MeetingRoom createRoom(MeetingRoom room, long ownerId);

    boolean leaveRoom(long roomId, long userId);

    void joinRoom(long roomId, long userId);

    void startMeeting(long roomId);

    void endMeeting(long roomId);
}
