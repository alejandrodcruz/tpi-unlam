package com.tpi.server.infrastructure.exceptions;

public class NoAddressesFoundException extends RuntimeException {
    public NoAddressesFoundException(Integer userId) {
        super("El usuario con ID " + userId + " no tiene direcciones asociadas.");
    }
}