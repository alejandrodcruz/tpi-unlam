package com.tpi.server.user;

import com.tpi.server.application.usecases.user.GetUserDataUseCase;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GetUserDataUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GetUserDataUseCase getUserDataUseCase;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = User.builder()
                .id(1)
                .username("usuarioejemplo")
                .email("usuario@gmail.com")
                .hasCompletedOnboarding(true)
                .build();
    }

    @Test
    void userExistsReturnsUser() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        User result = getUserDataUseCase.execute(1);
        assertNotNull(result);
        assertEquals("usuarioejemplo", result.getUsername());
        verify(userRepository, times(1)).findById(1);
    }

    @Test
    void userDoesNotExistThrowsRuntimeException() {
        when(userRepository.findById(2)).thenReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            getUserDataUseCase.execute(2);
        });
        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(userRepository, times(1)).findById(2);
    }
}
