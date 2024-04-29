package com.d208.AIclerk.exception.meeting;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class FolderException extends RuntimeException {
    private final HttpStatus status;

    public FolderException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public static FolderException folderTitleLengthException() {
        return new FolderException("폴더 제목의 길이가 맞지 않습니다.", HttpStatus.BAD_REQUEST);
    }

}
