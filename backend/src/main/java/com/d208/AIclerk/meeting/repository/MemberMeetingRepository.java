package com.d208.AIclerk.meeting.repository;

import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.entity.MemberMeeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MemberMeetingRepository extends JpaRepository<MemberMeeting, Long > {

    List<MemberMeeting> findAllByFolder_Id(Long folderId);

    List<MemberMeeting> findAllByRoomId(Long roomId);

    List<MemberMeeting> findAllByMember(Member member);

    @Query(value = "WITH OrderedMeetings AS (" +
            "  SELECT mm.member_meeting_id, mm.room_id AS mm_room_id, md.meeting_detail_id, " +
            "         md.room_id AS md_room_id, " +
            "         COALESCE(LAG(md.meeting_detail_id) OVER (ORDER BY mm.member_meeting_id), 0) AS prev_detail_id," +
            "         COALESCE(LEAD(md.meeting_detail_id) OVER (ORDER BY mm.member_meeting_id), 0) AS next_detail_id" +
            "  FROM member_meeting mm" +
            "  JOIN meeting_detail md ON mm.room_id = md.meeting_detail_id" +
            "  WHERE mm.member_id = ?1" +
            ")" +
            "SELECT prev_detail_id, next_detail_id " +
            "FROM OrderedMeetings " +
            "WHERE mm_room_id = ?2",
            nativeQuery = true)
    Optional<Object[]> findPreviousAndNextDetailIds(Long memberId, Long roomId);





}
