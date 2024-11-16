package com.tpi.server.infrastructure.exceptions;

public class NoProfilesFoundException extends RuntimeException {
    public NoProfilesFoundException(Integer userId) {
        super("El usuario con ID " + userId + " no tiene perfiles asociados.");
    }
}
