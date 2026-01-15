package com.fsk.blogsitebackend.common;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseUtil {

    private ResponseUtil() {}

    public static <T> ResponseEntity<GenericResponse<T>> successResponse(T data, String message, HttpStatus status) {
        GenericResponse<T> response = GenericResponse.<T>builder()
                .isSuccess(true)
                .message(message)
                .data(data)
                .status(status)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(status).body(response);
    }

    public static <T> ResponseEntity<GenericResponse<T>> successResponse(T data, String message) {
        return successResponse(data, message, HttpStatus.OK);
    }

    public static <T> ResponseEntity<GenericResponse<T>> errorResponse(String error, HttpStatus status) {
        GenericResponse<T> response = GenericResponse.<T>builder()
                .isSuccess(false)
                .error(error)
                .status(status)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(status).body(response);
    }

    public static <T> ResponseEntity<GenericResponse<T>> errorResponse(String error, String message, HttpStatus status) {
        GenericResponse<T> response = GenericResponse.<T>builder()
                .isSuccess(false)
                .error(error)
                .message(message)
                .status(status)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(status).body(response);
    }

}
