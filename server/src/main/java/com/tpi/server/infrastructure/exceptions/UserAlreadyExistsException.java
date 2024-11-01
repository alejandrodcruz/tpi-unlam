package com.tpi.server.infrastructure.exceptions;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String field, String value) {
        super(String.format("El %s '%s' ya está en uso.", field, value));
    }
}
