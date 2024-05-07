package com.d208.AIclerk.chatting.dto.responseDto;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CreateRoomResponseDto {
    private String invite_code;
    private long state;
    private String title;
    private String message;
    private long roomId;


    private String sender;
    private String profile;
    private LocalDateTime sent_time;
    private long senderId;





}
