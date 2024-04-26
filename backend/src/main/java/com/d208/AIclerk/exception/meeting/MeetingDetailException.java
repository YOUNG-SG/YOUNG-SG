package com.d208.AIclerk.exception.meeting;

public class MeetingDetailException extends RuntimeException{

    public MeetingDetailException(String message) { super(message); }

    public static MeetingDetailException meetingDetailNotFoundException() {
        return new MeetingDetailException("해당 회의 상세 페이지가 없습니다.");
    }
}
