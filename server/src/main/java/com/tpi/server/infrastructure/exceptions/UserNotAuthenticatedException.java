package com.tpi.server.infrastructure.exceptions;

public class UserNotAuthenticatedException extends RuntimeException {
    public UserNotAuthenticatedException() {
        super("Usuario no autenticado correctamente.");
    }
}