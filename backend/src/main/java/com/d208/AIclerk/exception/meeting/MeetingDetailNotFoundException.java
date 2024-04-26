package com.d208.AIclerk.exception.meeting;

public class MeetingDetailNotFoundException extends RuntimeException{

    public MeetingDetailNotFoundException(String message) { super(message); }

    public static MeetingDetailNotFoundException meetingDetailNotFoundException() {
        return new MeetingDetailNotFoundException("해당 회의 상세 페이지가 없습니다.");
    }

}
