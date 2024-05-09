package com.d208.AIclerk.chatting.exception;

public class RecordException  extends RuntimeException{

    public RecordException(String message) {
        super(message);
    }


    public static RecordException rException() {
        return new RecordException("");
    }
}
