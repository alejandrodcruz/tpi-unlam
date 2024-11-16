package com.tpi.server.infrastructure.exceptions;

public class DeviceNotOwnedByUserException extends RuntimeException {
    public DeviceNotOwnedByUserException(String deviceId, Integer userId) {
        super("El dispositivo con ID " + deviceId + " no pertenece al usuario con ID " + userId + ".");
    }
}