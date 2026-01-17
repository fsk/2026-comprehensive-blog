package com.fsk.blogsitebackend.common.exception;

import java.util.stream.Collectors;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fsk.blogsitebackend.common.ErrorMessages;
import com.fsk.blogsitebackend.common.GenericResponse;
import com.fsk.blogsitebackend.common.ResponseUtil;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<GenericResponse<Void>> handleResourceNotFoundException(ResourceNotFoundException e) {
        String message = getNotFoundMessage(e.getResourceName());
        return ResponseUtil.errorResponse(e.getMessage(), message, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(SlugAlreadyExistsException.class)
    public ResponseEntity<GenericResponse<Void>> handleSlugAlreadyExistsException(SlugAlreadyExistsException e) {
        return ResponseUtil.errorResponse(e.getMessage(), ErrorMessages.DUPLICATE_SLUG, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<GenericResponse<Void>> handleUserAlreadyExistsException(UserAlreadyExistsException e) {
        return ResponseUtil.errorResponse(e.getMessage(), ErrorMessages.USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NoUsersFoundException.class)
    public ResponseEntity<GenericResponse<Void>> handleNoUsersFoundException(NoUsersFoundException e) {
        return ResponseUtil.errorResponse(e.getMessage(), ErrorMessages.NO_USERS_FOUND,
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<GenericResponse<Void>> handleRuntimeException(RuntimeException e) {
        return ResponseUtil.errorResponse(e.getMessage(), ErrorMessages.RUNTIME_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<GenericResponse<Void>> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseUtil.errorResponse(e.getMessage(), String.format(ErrorMessages.INVALID_STATUS, e.getMessage()),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<GenericResponse<Void>> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        if (errorMessage.isEmpty()) {
            errorMessage = e.getBindingResult().getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining(", "));
        }

        if (errorMessage.isEmpty()) {
            errorMessage = ErrorMessages.VALIDATION_ERROR;
        }

        return ResponseUtil.errorResponse(errorMessage, HttpStatus.BAD_REQUEST);
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

        return ResponseUtil.errorResponse(errorMessage, ErrorMessages.DATA_INTEGRITY_VIOLATION, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<GenericResponse<Void>> handleAccessDeniedException(
            org.springframework.security.access.AccessDeniedException e) {
        return ResponseUtil.errorResponse(ErrorMessages.ACCESS_DENIED_TITLE, ErrorMessages.ACCESS_DENIED_DETAIL,
                HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<GenericResponse<Void>> handleAuthenticationException(
            org.springframework.security.core.AuthenticationException e) {
        return ResponseUtil.errorResponse(ErrorMessages.AUTH_FAILED_TITLE,
                ErrorMessages.AUTH_FAILED_DETAIL, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<GenericResponse<Void>> handleDataAccessException(DataAccessException e) {
        return ResponseUtil.errorResponse(e.getMessage(), ErrorMessages.DATABASE_ACCESS_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<GenericResponse<Void>> handleGenericException(Exception e) {
        return ResponseUtil.errorResponse(e.getMessage(), ErrorMessages.UNEXPECTED_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR);
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
