package com.d208.AIclerk.chatting.exception;

public class LeaveMeetingException  extends RuntimeException{

    public LeaveMeetingException(String message) {
        super(message);
    }


    public static LeaveMeetingException rException() {
        return new LeaveMeetingException("");
    }
}
