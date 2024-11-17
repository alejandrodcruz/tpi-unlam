package com.tpi.server.infrastructure.exceptions;

public class DeviceAlreadyExistsException extends RuntimeException {
    public DeviceAlreadyExistsException(String deviceId) {
        super("El dispositivo con ID " + deviceId + " ya existe.");
    }
}