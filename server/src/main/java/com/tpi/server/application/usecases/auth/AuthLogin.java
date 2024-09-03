package com.tpi.server.application.usecases.auth;

import com.tpi.server.infrastructure.dtos.AuthResponse;
import com.tpi.server.infrastructure.dtos.LoginRequest;
import org.springframework.stereotype.Service;

@Service
public class AuthLogin {
    public AuthResponse login(LoginRequest loginRequest) {
        return null;
    }
}
