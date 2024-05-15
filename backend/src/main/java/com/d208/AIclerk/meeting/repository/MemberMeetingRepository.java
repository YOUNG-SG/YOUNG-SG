package com.d208.AIclerk.meeting.repository;

import com.d208.AIclerk.entity.Folder;
import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.entity.MemberMeeting;
import com.d208.AIclerk.meeting.dto.meetingListDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberMeetingRepository extends JpaRepository<MemberMeeting, Long > {

    List<MemberMeeting> findAllByFolder_Id(Long folderId);

    List<MemberMeeting> findAllByRoomId(Long roomId);

    List<MemberMeeting> findAllByMember(Member member);

    @Query(value = "SELECT mm.folder.id FROM MemberMeeting mm WHERE mm.member.id = :memberId AND mm.roomId = :roomId")
    Long findFolderIdByMemberIdAndRoomId(@Param("memberId") Long memberId, @Param("roomId") Long roomId);

    @Query(value = "SELECT mm.roomId FROM MemberMeeting mm  WHERE mm.folder.id = :folderId AND mm.roomId < :roomId ORDER BY mm.roomId DESC LIMIT 1")
    Optional<Long> findPreRoomId(@Param("folderId") Long folderId, @Param("roomId") Long roomId);

    @Query(value ="SELECT mm.roomId FROM MemberMeeting mm WHERE mm.folder.id = :folderId AND mm.roomId > :roomId ORDER BY mm.roomId ASC LIMIT 1")
    Optional<Long> findNextRoomId(@Param("folderId") Long folderId, @Param("roomId") Long roomId);

    @Query("select new com.d208.AIclerk.meeting.dto.meetingListDto(m.roomId, f.title, d.title, d.startTime) " +
            "from MemberMeeting m " +
            "inner join Folder f on m.folder.id = f.id " +
            "inner join MeetingRoom  d on m.roomId = d.id " +
            "where m.member = :member " +
            "order by d.startTime desc ")
    List<meetingListDto> findAllByMemberOrderByStartTime(@Param("member") Member member);




}
