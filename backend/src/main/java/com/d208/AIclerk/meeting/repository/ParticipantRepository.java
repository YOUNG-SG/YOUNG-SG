package com.d208.AIclerk.meeting.repository;

import com.d208.AIclerk.entity.MeetingRoom;
import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    List<Participant> findAllByMeetingRoom_Id(Long roomId);

    Long countAllByMeetingRoom_Id(Long roomId);
    boolean existsByMemberAndMeetingRoom(Member member, MeetingRoom meetingRoom);


}
