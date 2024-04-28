package com.d208.AIclerk.member.dto.responseDto;

import com.d208.AIclerk.entity.Member;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetMemberResponseDTO {

    private String email;
    private String nickname;
    private String image;

}
