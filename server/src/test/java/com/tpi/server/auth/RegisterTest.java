package com.tpi.server.auth;

import com.tpi.server.application.services.security.JwtService;
import com.tpi.server.application.usecases.auth.AuthRegister;
import com.tpi.server.domain.enums.Role;
import com.tpi.server.domain.models.Address;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.dtos.AuthResponse;
import com.tpi.server.infrastructure.dtos.RegisterRequest;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

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
    @DisplayName("Debe registrar un nuevo usuario con dirección y retornar un token válido")
    public void shouldRegisterNewUserWithAddressAndReturnValidToken() {
        // Request para registrar
        RegisterRequest registerRequest = RegisterRequest
                .builder()
                .username("UserName")
                .password("123")
                .email("Test@test.com")
                .street("Calle Falsa 123")
                .city("Springfield")
                .country("Estados Unidos")
                .build();

        User savedUser = User.builder()
                .id(1)
                .username(registerRequest.getUsername())
                .password("encodedPassword")
                .email(registerRequest.getEmail())
                .role(Role.USER)
                .addresses(new HashSet<>())
                .build();

        Mockito.when(passwordEncoder.encode(Mockito.anyString())).thenReturn("encodedPassword");
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(savedUser.getId());
            return user;
        });
        Mockito.when(jwtService.getToken(Mockito.any(User.class))).thenReturn("TokenJWT");

        // Ejecutar registro
        AuthResponse response = authRegister.register(registerRequest);

        // Response no sea nulo
        Assertions.assertNotNull(response);
        // Token sea el esperado
        Assertions.assertEquals("TokenJWT", response.getToken());
        // Que el ID sea el esperado
        Assertions.assertEquals(savedUser.getId(), response.getId());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        Mockito.verify(userRepository).save(userCaptor.capture());
        User userToSave = userCaptor.getValue();

        // Ver si el Usuario tiene una dirección asociada
        Assertions.assertNotNull(userToSave.getAddresses());
        Assertions.assertFalse(userToSave.getAddresses().isEmpty());

        // Verificar los campos guardados
        Address address = userToSave.getAddresses().iterator().next();
        Assertions.assertEquals("Calle Falsa 123", address.getStreet());
        Assertions.assertEquals("Springfield", address.getCity());
        Assertions.assertEquals("Estados Unidos", address.getCountry());
        Assertions.assertEquals(userToSave, address.getUser());
    }
}
