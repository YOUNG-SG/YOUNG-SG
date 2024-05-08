package com.d208.AIclerk.chatting.exception;

public class CreateMeetingException  extends RuntimeException{

    public CreateMeetingException(String message) {
        super(message);
    }

    public static CreateMeetingException Exists() {
        return new CreateMeetingException("");
    }



}
