package com.tpi.server.application.usecases.auth;

import com.tpi.server.application.services.security.JwtService;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.dtos.AuthResponse;
import com.tpi.server.infrastructure.dtos.LoginRequest;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthLogin {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));
        User user=userRepository.findByUsername(request.getUsername()).orElseThrow();
        String token=jwtService.getToken(user);
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .build();
    }
}
