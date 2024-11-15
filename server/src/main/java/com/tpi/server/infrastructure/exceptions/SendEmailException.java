package com.tpi.server.infrastructure.exceptions;

import com.tpi.server.infrastructure.dtos.AlertDTO;

public class SendEmailException extends RuntimeException {
    public SendEmailException() {
        super("Error al enviar email");
    }
}