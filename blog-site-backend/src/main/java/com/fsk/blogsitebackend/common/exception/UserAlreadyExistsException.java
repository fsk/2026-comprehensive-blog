package com.fsk.blogsitebackend.common.exception;

public class UserAlreadyExistsException extends RuntimeException {

    private final String field;
    private final String value;

    public UserAlreadyExistsException(String field, String value) {
        super(String.format("User already exists with %s: '%s'", field, value));
        this.field = field;
        this.value = value;
    }

    public String getField() {
        return field;
    }

    public String getValue() {
        return value;
    }
}
