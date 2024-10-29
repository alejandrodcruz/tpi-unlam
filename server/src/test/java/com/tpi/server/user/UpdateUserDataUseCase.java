package com.tpi.server.user;

import com.tpi.server.application.usecases.user.UpdateUserDataUseCase;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UpdateUserDataUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UpdateUserDataUseCase updateUserDataUseCase;

    private User existingUser;
    private User updatedUserData;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        existingUser = User.builder()
                .id(1)
                .username("usuarioAnterior")
                .email("anterior@gmail.com")
                .hasCompletedOnboarding(false)
                .build();

        updatedUserData = User.builder()
                .username("usuarioNuevo")
                .email("nuevo@gmail.com")
                .hasCompletedOnboarding(true)
                .build();
    }

    @Test
    void userExistsUpdatesAndReturnsUser() {
        when(userRepository.findById(1)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(existingUser)).thenReturn(existingUser);

        User result = updateUserDataUseCase.execute(1, updatedUserData);

        assertNotNull(result);
        assertEquals("usuarioNuevo", result.getUsername());
        assertEquals("nuevo@gmail.com", result.getEmail());
        assertTrue(result.isHasCompletedOnboarding());
        verify(userRepository, times(1)).findById(1);
        verify(userRepository, times(1)).save(existingUser);
    }

    @Test
    void userDoesNotExistThrowsRuntimeException() {
        when(userRepository.findById(2)).thenReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            updateUserDataUseCase.execute(2, updatedUserData);
        });
        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(userRepository, times(1)).findById(2);
        verify(userRepository, never()).save(any(User.class));
    }
}
