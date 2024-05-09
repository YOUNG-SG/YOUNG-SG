package com.d208.AIclerk.chatting.exception;

public class EndMeetingException extends RuntimeException{

    public EndMeetingException(String message) {
        super(message);
    }

    public static EndMeetingException rException() {
        return new EndMeetingException("");
    }


}
