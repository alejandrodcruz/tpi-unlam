package com.tpi.server.infrastructure.exceptions;

import com.tpi.server.domain.enums.AlertType;

public class AlertTypeNotFoundException extends RuntimeException {
    public AlertTypeNotFoundException(AlertType alertType) {
        super(String.format("Tipo de alerta no reconocido: ", alertType));
    }
}
