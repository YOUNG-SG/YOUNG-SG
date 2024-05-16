package com.d208.AIclerk.meeting.repository;

import com.d208.AIclerk.entity.MeetingDetail;
import com.d208.AIclerk.entity.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingDetailRepository extends JpaRepository<MeetingDetail, Long> {

    MeetingDetail findByMeetingRoom_Id(Long roomId);
    List<MeetingDetail> findAllByMeetingRoom_Id(Long roomId);

}
