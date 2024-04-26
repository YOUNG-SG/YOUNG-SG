package com.d208.AIclerk.exception.meeting;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CommentException extends RuntimeException {
    private final HttpStatus status; // 예외 상태 코드 추가

    public CommentException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    // 각 예외 상황에 맞는 예외 생성 메서드
    public static CommentException commentLengthException() {
        return new CommentException("내용이 없거나 길이가 맞지 않습니다.", HttpStatus.BAD_REQUEST);
    }

    public static CommentException commentNotFoundException() {
        return new CommentException("해당 코멘트가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
    }

    public static CommentException commentExistException() {
        return new CommentException("이미 코멘트를 작성 했습니다. 수정하기를 이용하세요.", HttpStatus.CONFLICT);
    }

    public static CommentException memberNotEqualException() {
        return new CommentException("해당 코멘트 작성자가 아닙니다.", HttpStatus.FORBIDDEN);
    }
}