package com.d208.AIclerk.meeting.dto.requestDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaveMeetingRequestDto {

    private Long folderId;

    private Long detailId;

}
