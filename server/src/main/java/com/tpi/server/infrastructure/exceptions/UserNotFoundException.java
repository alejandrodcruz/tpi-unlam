package com.tpi.server.infrastructure.exceptions;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Integer userId) {
        super("Usuario con ID " + userId + " no existe.");
    }
}