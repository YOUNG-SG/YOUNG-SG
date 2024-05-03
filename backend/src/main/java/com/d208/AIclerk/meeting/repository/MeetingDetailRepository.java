package com.d208.AIclerk.meeting.repository;

import com.d208.AIclerk.entity.MeetingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface MeetingDetailRepository extends JpaRepository<MeetingDetail, Long> {
    Optional<MeetingDetail> findById(Long id);
}
