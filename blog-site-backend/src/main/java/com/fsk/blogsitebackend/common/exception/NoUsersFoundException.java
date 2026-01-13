package com.fsk.blogsitebackend.common.exception;

public class NoUsersFoundException extends RuntimeException {

    public NoUsersFoundException() {
        super("No users found in the system. Please create a user first.");
    }
}
