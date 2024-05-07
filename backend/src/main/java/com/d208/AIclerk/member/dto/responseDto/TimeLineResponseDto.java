package com.d208.AIclerk.member.dto.responseDto;

import lombok.Builder;
import lombok.Getter;

import java.util.HashMap;
import java.util.List;
import java.util.TreeMap;

@Getter
public class TimeLineResponseDto {
    private TreeMap<Integer, TreeMap<Integer, List<TimeLineDayDto>>> timeLineList;

    @Builder
    private TimeLineResponseDto(TreeMap<Integer, TreeMap<Integer, List<TimeLineDayDto>>> timeLineList){
        this.timeLineList = timeLineList;
    }

    public static TimeLineResponseDto of(TreeMap<Integer, TreeMap<Integer, List<TimeLineDayDto>>> timeLineList) {
        return builder()
                .timeLineList(timeLineList)
                .build();
    }
}
