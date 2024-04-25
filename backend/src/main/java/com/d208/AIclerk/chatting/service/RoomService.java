package com.d208.AIclerk.chatting.service;

import com.d208.AIclerk.entity.MeetingRoom;

public interface RoomService {

    /*
     * ResponseEntity로 변경할것 .
     * */

    MeetingRoom createRoom(MeetingRoom room, String ownerId);

    boolean leaveRoom(String roomId, Long userId);

    void joinRoom(String roomId, String userId);

    void startMeeting(String roomId);

    void endMeeting(String roomId);
}
