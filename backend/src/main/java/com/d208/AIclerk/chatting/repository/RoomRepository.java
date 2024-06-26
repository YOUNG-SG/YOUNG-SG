package com.d208.AIclerk.chatting.repository;

import com.d208.AIclerk.entity.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<MeetingRoom, Long> {

    boolean existsByInviteCode(String inviteCode); //초대코드 중복검사

    Optional<MeetingRoom> findByInviteCode(String inviteCode);







}
