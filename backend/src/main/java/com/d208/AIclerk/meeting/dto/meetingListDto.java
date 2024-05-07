package com.d208.AIclerk.meeting.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class meetingListDto {
    // 폴더 이름. 날짜, 회의 제목
    private Long roomId;
    private String folderTitle;
    private String roomTitle;
    private LocalDateTime startTime;

    public meetingListDto(Long roomId, String folderTitle, String roomTitle, LocalDateTime startTime) {
        this.roomId = roomId;
        this.folderTitle = folderTitle;
        this.roomTitle = roomTitle;
        this.startTime = startTime;
    }
}
