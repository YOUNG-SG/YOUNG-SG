package com.d208.AIclerk.member.dto.responseDto;

import lombok.*;

@Getter
public class EditMemberResponseDto {
    private String profileImg;
    private String nickname;

    @Builder
    private EditMemberResponseDto(String profileImg, String nickname) {
        this.profileImg = profileImg;
        this.nickname = nickname;
    }

    public static EditMemberResponseDto of(String profileImg, String nickname){
        return builder()
                .profileImg(profileImg)
                .nickname(nickname)
                .build();
    }
}
