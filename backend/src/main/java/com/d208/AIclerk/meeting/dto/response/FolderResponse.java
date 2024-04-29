package com.d208.AIclerk.meeting.dto.response;

import com.d208.AIclerk.entity.Folder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@NoArgsConstructor @AllArgsConstructor
public class FolderResponse {

    private String message;

    private List<Folder> data;
}
