package com.d208.AIclerk.exception.handler;

import com.d208.AIclerk.exception.meeting.CommentException;
import com.d208.AIclerk.exception.meeting.MeetingDetailException;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Collections;

@RestControllerAdvice
@RequiredArgsConstructor
public class MeetingGlobalExceptionHandler {

    private final Gson gson;
    private static final HttpHeaders JSON_HEADERS;
    static {
        JSON_HEADERS = new HttpHeaders();
        JSON_HEADERS.add(HttpHeaders.CONTENT_TYPE, "application/json");
    }

    @ExceptionHandler(CommentException.class)
    public ResponseEntity<String> handleCommentException(CommentException e) {
        return ResponseEntity.status(e.getStatus())
                .headers(JSON_HEADERS)
                .body(stringToGson(e.getMessage()));
    }

    @ExceptionHandler(MeetingDetailException.class)
    public ResponseEntity<String> handleMeetingDetailException(MeetingDetailException e) {
        return ResponseEntity
                .status(e.getStatus())
                .body(e.getMessage());
    }

    public String stringToGson(String message){
        return gson.toJson(Collections.singletonMap("message", message));
    }
}

