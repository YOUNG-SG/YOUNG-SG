package com.d208.AIclerk.meeting.dto.responseDto;

import com.d208.AIclerk.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@NoArgsConstructor @AllArgsConstructor
public class MeetingDetailResponseDto {

    private Long detailId;

    private String summary;

    private List<ParticipantInfoDto> participantInfoDtoList;

    private String fileUrl;

    private Long preMeetingId;

    private Long nextMeetingId;

    private String date;

}
