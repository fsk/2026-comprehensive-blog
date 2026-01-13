package com.fsk.blogsitebackend.common.exception;

import java.time.LocalDateTime;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fsk.blogsitebackend.common.ErrorMessages;
import com.fsk.blogsitebackend.common.GenericResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<GenericResponse<Void>> handleResourceNotFoundException(ResourceNotFoundException e) {
        String message = getNotFoundMessage(e.getResourceName());
        GenericResponse<Void> response = GenericResponse.<Void>builder()
                .isSuccess(false)
                .error(e.getMessage())
                .message(message)
                .status(HttpStatus.NOT_FOUND)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(SlugAlreadyExistsException.class)
    public ResponseEntity<GenericResponse<Void>> handleSlugAlreadyExistsException(SlugAlreadyExistsException e) {
        GenericResponse<Void> response = GenericResponse.<Void>builder()
                .isSuccess(false)
                .error(e.getMessage())
                .message(ErrorMessages.DUPLICATE_SLUG)
                .status(HttpStatus.CONFLICT)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<GenericResponse<Void>> handleUserAlreadyExistsException(UserAlreadyExistsException e) {
        GenericResponse<Void> response = GenericResponse.<Void>builder()
                .isSuccess(false)
                .error(e.getMessage())
                .message("User already exists")
                .status(HttpStatus.CONFLICT)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(NoUsersFoundException.class)
    public ResponseEntity<GenericResponse<Void>> handleNoUsersFoundException(NoUsersFoundException e) {
        GenericResponse<Void> response = GenericResponse.<Void>builder()
                .isSuccess(false)
                .error(e.getMessage())
                .message(ErrorMessages.NO_USERS_FOUND)
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<GenericResponse<Void>> handleRuntimeException(RuntimeException e) {
        GenericResponse<Void> response = GenericResponse.<Void>builder()
                .isSuccess(false)
                .error(e.getMessage())
                .message(ErrorMessages.RUNTIME_ERROR)
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<GenericResponse<Void>> handleIllegalArgumentException(IllegalArgumentException e) {
        GenericResponse<Void> response = GenericResponse.<Void>builder()
                .isSuccess(false)
                .error(e.getMessage())
                .message(String.format(ErrorMessages.INVALID_STATUS, e.getMessage()))
                .status(HttpStatus.BAD_REQUEST)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<GenericResponse<Void>> handleDataIntegrityViolationException(
            DataIntegrityViolationException e) {
        String errorMessage = e.getMessage();

        if (errorMessage != null) {
            if (errorMessage.contains("unique constraint") || errorMessage.contains("duplicate key")) {
                errorMessage = ErrorMessages.DUPLICATE_RECORD;
            } else if (errorMessage.contains("foreign key constraint")
                    || errorMessage.contains("violates foreign key constraint")) {
                errorMessage = ErrorMessages.REFERENCED_RECORD_NOT_FOUND;
            } else if (errorMessage.contains("not null constraint")
                    || errorMessage.contains("violates not-null constraint")) {
                errorMessage = ErrorMessages.REQUIRED_FIELD_NULL;
            } else if (errorMessage.contains("check constraint")
                    || errorMessage.contains("violates check constraint")) {
                errorMessage = ErrorMessages.VALIDATION_FAILED;
            } else if (errorMessage.contains("value too long") || errorMessage.contains("character varying")) {
                errorMessage = ErrorMessages.VALUE_TOO_LONG;
            }
        } else {
            errorMessage = ErrorMessages.DATA_INTEGRITY_DEFAULT;
        }

        GenericResponse<Void> response = GenericResponse.<Void>builder()
                .isSuccess(false)
                .error(errorMessage)
                .message(ErrorMessages.DATA_INTEGRITY_VIOLATION)
                .status(HttpStatus.BAD_REQUEST)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<GenericResponse<Void>> handleDataAccessException(DataAccessException e) {
        GenericResponse<Void> response = GenericResponse.<Void>builder()
                .isSuccess(false)
                .error(e.getMessage())
                .message(ErrorMessages.DATABASE_ACCESS_ERROR)
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<GenericResponse<Void>> handleGenericException(Exception e) {
        GenericResponse<Void> response = GenericResponse.<Void>builder()
                .isSuccess(false)
                .error(e.getMessage())
                .message(ErrorMessages.UNEXPECTED_ERROR)
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    private String getNotFoundMessage(String resourceName) {
        return switch (resourceName.toLowerCase()) {
            case "user" -> ErrorMessages.USER_NOT_FOUND;
            case "post" -> ErrorMessages.POST_NOT_FOUND;
            case "comment" -> ErrorMessages.COMMENT_NOT_FOUND;
            case "tag" -> ErrorMessages.TAG_NOT_FOUND;
            case "category" -> ErrorMessages.CATEGORY_NOT_FOUND;
            case "asset" -> ErrorMessages.ASSET_NOT_FOUND;
            default -> resourceName + " not found";
        };
    }
}
