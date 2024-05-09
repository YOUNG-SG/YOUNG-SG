package com.d208.AIclerk.chatting.dto.requestDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangeOwnerDTO {

    private long ownerid;
    private long roomid;
}
