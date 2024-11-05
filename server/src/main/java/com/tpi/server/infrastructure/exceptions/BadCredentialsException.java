package com.tpi.server.infrastructure.exceptions;

import org.springframework.security.core.AuthenticationException;

public class BadCredentialsException extends AuthenticationException {
    public BadCredentialsException() {
        super(String.format("Usuario o passwords erroneo"));
    }
}
