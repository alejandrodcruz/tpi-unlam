package com.tpi.server.infrastructure.exceptions;

public class NoDevicesFoundException extends RuntimeException {
    public NoDevicesFoundException(Integer userId) {
        super("El usuario con ID " + userId + " no tiene dispositivos asociados.");
    }
}
