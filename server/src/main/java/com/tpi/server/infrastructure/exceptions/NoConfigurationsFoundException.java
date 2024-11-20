package com.tpi.server.infrastructure.exceptions;

public class NoConfigurationsFoundException extends RuntimeException {
    public NoConfigurationsFoundException(Integer userId) {
        super("El usuario con ID " + userId + " no tiene configuraciones asociadas.");
    }
}