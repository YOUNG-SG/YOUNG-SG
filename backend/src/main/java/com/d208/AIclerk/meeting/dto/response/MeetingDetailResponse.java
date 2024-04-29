package com.d208.AIclerk.meeting.dto.response;

import com.d208.AIclerk.meeting.dto.responseDto.MeetingDetailResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@AllArgsConstructor @NoArgsConstructor
@Data
public class MeetingDetailResponse {

    private String message;

    private MeetingDetailResponseDto data;

}
