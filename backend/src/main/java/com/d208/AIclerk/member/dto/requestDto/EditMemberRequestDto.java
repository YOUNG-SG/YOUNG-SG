package com.d208.AIclerk.member.dto.requestDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class EditMemberRequestDto {
    private MultipartFile profileImg;
    private String nickname;
}
