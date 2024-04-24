package com.d208.AIclerk.chatting.dto.requestDto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {

    private String sender;
    private String content;
}
