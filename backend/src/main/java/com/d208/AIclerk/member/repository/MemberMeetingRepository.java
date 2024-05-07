package com.d208.AIclerk.member.repository;

import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.entity.MemberMeeting;
import com.d208.AIclerk.member.dto.meetingListDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface MemberMeetingRepository extends JpaRepository<MemberMeeting, Long > {
    @Query("select new com.d208.AIclerk.member.dto.meetingListDto(m.roomId, f.title, d.title, d.startTime) " +
            "from MemberMeeting m " +
            "inner join Folder f on m.folder.id = f.id " +
            "inner join MeetingRoom  d on m.roomId = d.id " +
            "where m.member = :member " +
            "order by d.startTime desc ")
    List<meetingListDto> findAllByMember(@Param("member") Member member);
}
