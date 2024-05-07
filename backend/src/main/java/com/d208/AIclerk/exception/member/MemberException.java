package com.d208.AIclerk.exception.member;

import com.d208.AIclerk.exception.meeting.CommentException;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class MemberException extends RuntimeException{
    private final HttpStatus status;

    public MemberException(String message, HttpStatus status){
        super(message);
        this.status = status;
    }

    // 상황에 맞는 예외 처리
    public static MemberException memberMeetingNotFound() {
        return new MemberException("해당 회의가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
    }

    public static MemberException memberMeetingNotEqualException() {
        return new MemberException("해당 회의에 접근할 권한이 없습니다.", HttpStatus.FORBIDDEN);
    }
}
