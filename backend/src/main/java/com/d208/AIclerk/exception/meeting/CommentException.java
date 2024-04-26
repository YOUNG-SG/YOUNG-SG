package com.d208.AIclerk.exception.meeting;

public class CommentException extends RuntimeException{
    public CommentException(String message) {
        super(message);
    }

    public static CommentException commentLengthException() {
        return new CommentException("내용이 없거나 길이가 맞지 않습니다.");
    }

    public static CommentException commentNotFoundException() {
        return new CommentException("해당 코멘트가 존재하지 않습니다.");}

    public static CommentException commentExistException() {
        return new CommentException("이미 코멘트를 작성 했습니다. 수정하기를 이용하세요.");
    }

    public static CommentException memberNotEqualException() {
        return new CommentException("해당 코멘트 작성자가 아닙니다.");
    }

}