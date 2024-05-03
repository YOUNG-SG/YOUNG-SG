package com.d208.AIclerk.meeting.repository;

import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.entity.MemberMeeting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberMeetingRepository extends JpaRepository<MemberMeeting, Long > {
    List<MemberMeeting> findAllByMember(Member member);
}
