package com.d208.AIclerk.chatting.dto.requestDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoteMessageDto {
    private Long senderId;
    private String sender; //Nickname
    private int voteType; // 0: 기본,1:찬성 2반대 3질문 ...
}
