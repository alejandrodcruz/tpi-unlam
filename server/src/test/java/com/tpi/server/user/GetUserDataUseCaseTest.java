package com.tpi.server.user;

import com.tpi.server.application.usecases.user.GetUserDataUseCase;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
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
    void userDoesNotExistThrowsUserNotFoundException() {
        Integer nonExistentUserId = 2;
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            getUserDataUseCase.execute(nonExistentUserId);
        });

        assertEquals("Usuario con ID " + nonExistentUserId + " no existe.", exception.getMessage());
        verify(userRepository, times(1)).findById(nonExistentUserId);
    }
}
