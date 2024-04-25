package com.d208.AIclerk.folder.dto.RequestDto;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class FolderSelectRequestDto {
    private Long folderId;
    private Long meetingId;
}
