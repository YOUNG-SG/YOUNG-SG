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

    public static MeetingDetailException existDetailException() {
        return new MeetingDetailException("이미 해당 room의 상세페이지가 있습니다.", HttpStatus.BAD_REQUEST);
    }

    public static MeetingDetailException preAndNextDetailNotFoundException() {
        return new MeetingDetailException("이전, 이후 회의 목록을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }

    public static MeetingDetailException summaryNotFoundException() {
        return new MeetingDetailException("요약된 회의 내용을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }


}
