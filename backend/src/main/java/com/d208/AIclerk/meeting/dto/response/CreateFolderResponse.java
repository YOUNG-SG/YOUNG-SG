package com.d208.AIclerk.meeting.dto.response;

import com.d208.AIclerk.meeting.dto.responseDto.CreateFolderResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateFolderResponse {

    private String message;

    private CreateFolderResponseDto data;
}
