package com.d208.AIclerk.chatting.exception;

public class JoinRoomException  extends RuntimeException{

    public JoinRoomException(String message) {
        super(message);
    }

    public static JoinRoomException rException() {
        return new JoinRoomException(".");
    }
}
