package com.tpi.server.infrastructure.exceptions;

public class GetEmailForAlertException extends RuntimeException {
    public GetEmailForAlertException(String deviceId) {
        super("Error al obtener mail para alerte con device con Id" + deviceId);
    }
}