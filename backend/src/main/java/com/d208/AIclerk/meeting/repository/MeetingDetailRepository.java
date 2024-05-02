package com.d208.AIclerk.meeting.repository;

import com.d208.AIclerk.entity.MeetingDetail;
import com.d208.AIclerk.entity.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingDetailRepository extends JpaRepository<MeetingDetail, Long> {

}
