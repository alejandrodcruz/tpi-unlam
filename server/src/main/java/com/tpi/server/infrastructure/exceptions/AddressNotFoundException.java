package com.tpi.server.infrastructure.exceptions;

public class AddressNotFoundException extends RuntimeException {
    public AddressNotFoundException(Long addressId) {
        super("Dirección con ID " + addressId + " no encontrada");
    }
}
