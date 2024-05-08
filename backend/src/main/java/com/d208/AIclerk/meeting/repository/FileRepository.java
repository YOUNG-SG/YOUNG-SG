package com.d208.AIclerk.meeting.repository;

import com.d208.AIclerk.entity.File;
import com.d208.AIclerk.entity.MeetingDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, Long> {

    File findByMeetingDetail(MeetingDetail meetingDetail);

}
