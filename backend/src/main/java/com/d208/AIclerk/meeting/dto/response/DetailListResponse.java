package com.d208.AIclerk.meeting.dto.response;

import com.d208.AIclerk.meeting.dto.responseDto.DetailListResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetailListResponse {

    private String message;

    private List<DetailListResponseDto> data;

}
