package com.d208.AIclerk.chatting.repository;

import com.d208.AIclerk.entity.Summary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SummaryRepository  extends JpaRepository<Summary, Long> {
    Summary findContentByMeetingRoomId(Long roomId);
}
