package com.d208.AIclerk.meeting.repository;

import com.d208.AIclerk.entity.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {
    @Query("SELECT m.title FROM MeetingRoom m WHERE m.id = :id")
    String findTitleById(Long id);}
