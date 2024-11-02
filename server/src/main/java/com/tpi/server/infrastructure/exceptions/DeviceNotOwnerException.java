package com.tpi.server.infrastructure.exceptions;

public class DeviceNotOwnerException extends RuntimeException {
    public DeviceNotOwnerException(String deviceId, Integer userId) {
        super(String.format("El usuario con ID '%d' no tiene permiso para modificar el dispositivo con ID '%s'.", userId, deviceId));
    }
}
