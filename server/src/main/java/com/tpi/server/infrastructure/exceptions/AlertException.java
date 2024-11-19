package com.tpi.server.infrastructure.exceptions;

import com.tpi.server.infrastructure.dtos.AlertDTO;

public class AlertException extends RuntimeException {
    public AlertException(AlertDTO alertDTO) {
        super("Error al crear alerta" + alertDTO.toString());
    }
}