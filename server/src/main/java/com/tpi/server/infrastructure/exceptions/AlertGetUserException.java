package com.tpi.server.infrastructure.exceptions;

public class AlertGetUserException extends RuntimeException {
    public AlertGetUserException(String deviceId) {
        super("Error al obtener usuario del device con Id" + deviceId);
    }
}