package com.d208.AIclerk.member.dto.responseDto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class TimeLineDayDto {
    private Long meetingId;
    private int createdDay;
    private String folderTitle;
    private String roomTitle;

    @Builder
    private TimeLineDayDto(Long meetingId, int createdDay, String folderTitle, String roomTitle){
        this.meetingId = meetingId;
        this.createdDay = createdDay;
        this.folderTitle = folderTitle;
        this.roomTitle = roomTitle;
    }

    public static TimeLineDayDto of(Long meetingId, int createdDay, String folderTitle, String roomTitle) {
        return builder()
                .meetingId(meetingId)
                .createdDay(createdDay)
                .folderTitle(folderTitle)
                .roomTitle(roomTitle)
                .build();
    }
}
