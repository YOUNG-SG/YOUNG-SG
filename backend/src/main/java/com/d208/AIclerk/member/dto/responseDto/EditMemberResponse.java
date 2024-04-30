package com.d208.AIclerk.member.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class EditMemberResponse {
    private String profileImg;
    private String nickname;
}
