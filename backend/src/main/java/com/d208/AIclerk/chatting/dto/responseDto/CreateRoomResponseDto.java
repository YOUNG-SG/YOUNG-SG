package com.d208.AIclerk.chatting.dto.responseDto;


import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CreateRoomResponseDto {
    private String invite_code;
    private long state;
    private String title;

}
