package com.tpi.server.auth;

import com.tpi.server.application.services.security.JwtService;
import com.tpi.server.application.usecases.auth.AuthRegister;
import com.tpi.server.infrastructure.dtos.AuthResponse;
import com.tpi.server.infrastructure.dtos.RegisterRequest;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
public class RegisterTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthRegister authRegister;

    @Test
    @DisplayName("Should test register user.")
    public void shouldRegisterNewUserUseCaseReturnValidToken() {
        RegisterRequest registerRequest = RegisterRequest
                .builder()
                .username("UserName")
                .password("123")
                .email("Test@test.com")
                .build();

        AuthResponse authResponse = AuthResponse
            .builder()
            .token("TokenJWT")
            .build();


        Mockito.when(passwordEncoder.encode(Mockito.anyString())).thenReturn("encodedPassword");
        Mockito.when(userRepository.save(Mockito.any())).thenReturn(null);
        Mockito.when(jwtService.getToken(Mockito.any())).thenReturn("TokenJWT");

        AuthResponse response = authRegister.register(registerRequest);

        Assertions.assertNotNull(response);
        Assertions.assertEquals(response, authResponse);
    }
}
