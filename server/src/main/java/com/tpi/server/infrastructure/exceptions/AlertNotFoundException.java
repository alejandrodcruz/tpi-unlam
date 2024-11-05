package com.tpi.server.infrastructure.exceptions;

public class AlertNotFoundException extends RuntimeException {
    public AlertNotFoundException(String deviceId) {
        super(String.format("Alertas con ID '%s' no encontradas.", deviceId));
    }
}
