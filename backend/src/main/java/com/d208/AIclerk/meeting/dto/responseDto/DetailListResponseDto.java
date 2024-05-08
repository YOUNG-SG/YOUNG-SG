package com.d208.AIclerk.meeting.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetailListResponseDto {

    private Long detailId;

    private String title;

    private Long participantCnt;

    private Long commentCnt;

    private String date;

    private Long totalTime;

}
