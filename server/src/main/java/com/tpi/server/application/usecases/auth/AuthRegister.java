package com.tpi.server.application.usecases.auth;

import com.tpi.server.application.services.security.JwtService;
import com.tpi.server.domain.enums.Role;
import com.tpi.server.domain.models.Address;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.dtos.AuthResponse;
import com.tpi.server.infrastructure.dtos.RegisterRequest;
import com.tpi.server.infrastructure.exceptions.UserAlreadyExistsException;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthRegister {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest registerRequest) {
        // Verificaciones si existe ya el usuario o correo
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("nombre de usuario", registerRequest.getUsername());
        }
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("correo electrónico", registerRequest.getEmail());
        }

        // Crear usuario
        User user = User.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .email(registerRequest.getEmail())
                .role(Role.USER)
                .build();

        Address address = Address.builder()
                .street(registerRequest.getStreet())
                .city(registerRequest.getCity())
                .country(registerRequest.getCountry())
                .user(user)
                .build();

        user.getAddresses().add(address);

        userRepository.save(user);

        return AuthResponse.builder()
                .token(jwtService.getToken(user))
                .id(user.getId())
                .build();
    }
}
