package com.d208.AIclerk.chatting.exception;

public class GetRoomIdException  extends RuntimeException{

    public GetRoomIdException(String message) {
        super(message);
    }

    public static GetRoomIdException rException() {
        return new GetRoomIdException("평점을 부과하지 않았습니다.");
    }
}
