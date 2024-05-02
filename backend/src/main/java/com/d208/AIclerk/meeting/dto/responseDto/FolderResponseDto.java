package com.d208.AIclerk.meeting.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FolderResponseDto {

    private Long folderId;

    private String title;

    private Long totalTime;

}
