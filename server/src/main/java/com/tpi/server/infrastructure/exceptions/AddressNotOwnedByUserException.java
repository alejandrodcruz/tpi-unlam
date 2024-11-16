package com.tpi.server.infrastructure.exceptions;

public class AddressNotOwnedByUserException extends RuntimeException {
    public AddressNotOwnedByUserException(Long addressId, Integer userId) {
        super("La dirección con ID " + addressId + " no pertenece al usuario con ID " + userId);
    }
}