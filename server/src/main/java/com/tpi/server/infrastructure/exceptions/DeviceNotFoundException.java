package com.tpi.server.infrastructure.exceptions;

public class DeviceNotFoundException extends RuntimeException {
    public DeviceNotFoundException(String deviceId) {
        super(String.format("Dispositivo con ID '%s' no encontrado.", deviceId));
    }
}
