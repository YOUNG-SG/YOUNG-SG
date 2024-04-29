package com.d208.AIclerk.exception.meeting;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class MeetingDetailException extends RuntimeException{

    private final HttpStatus status;

    public MeetingDetailException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public static MeetingDetailException meetingDetailNotFoundException() {
        return new MeetingDetailException("해당 회의 상세 페이지가 없습니다.", HttpStatus.NOT_FOUND);
    }

}
