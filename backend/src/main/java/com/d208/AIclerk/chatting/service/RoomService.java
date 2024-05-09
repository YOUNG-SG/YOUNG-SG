package com.d208.AIclerk.chatting.service;

import com.d208.AIclerk.chatting.dto.responseDto.ChangeOwnerRespnoseDTO;
import com.d208.AIclerk.entity.MeetingRoom;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;

public interface RoomService {

    @Transactional
    ResponseEntity<ChangeOwnerRespnoseDTO> changeRoomOwner(Long roomId, Long newOwnerId);

    MeetingRoom createRoom(MeetingRoom room, long ownerId);

    boolean leaveRoom(long roomId, long userId);

    void joinRoom(long roomId, long userId);

    void startMeeting(long roomId);

    void endMeeting(long roomId);

    void pauseMeeting(Long roomId);
}
