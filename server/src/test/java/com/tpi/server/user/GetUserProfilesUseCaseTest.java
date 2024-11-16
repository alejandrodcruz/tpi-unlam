package com.tpi.server.user;

import com.tpi.server.application.usecases.user.GetUserProfilesUseCase;
import com.tpi.server.domain.models.Profile;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.exceptions.NoProfilesFoundException;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
import com.tpi.server.infrastructure.repositories.ProfileRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GetUserProfilesUseCaseTest {

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GetUserProfilesUseCase getUserProfilesUseCase;

    private User user;
    private Profile profile1;
    private Profile profile2;
    private List<Profile> profiles;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = User.builder()
                .id(1)
                .username("usuarioEjemplo")
                .email("usuario@gmail.com")
                .hasCompletedOnboarding(true)
                .build();

        profile1 = Profile.builder()
                .id(1L)
                .profileName("Perfil 1")
                .preferences("Preferencias 1")
                .user(user)
                .build();

        profile2 = Profile.builder()
                .id(2L)
                .profileName("Perfil 2")
                .preferences("Preferencias 2")
                .user(user)
                .build();

        profiles = Arrays.asList(profile1, profile2);
    }

    @Test
    void execute_UserExistsWithProfiles_ReturnsProfiles() {
        Integer userId = 1;
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(profileRepository.findByUserId(userId)).thenReturn(profiles);

        List<Profile> result = getUserProfilesUseCase.execute(userId);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.containsAll(profiles));

        verify(userRepository, times(1)).findById(userId);
        verify(profileRepository, times(1)).findByUserId(userId);
    }

    @Test
    void execute_UserDoesNotExist_ThrowsUserNotFoundException() {
        Integer nonExistentUserId = 2;
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            getUserProfilesUseCase.execute(nonExistentUserId);
        });

        assertEquals("Usuario con ID " + nonExistentUserId + " no existe.", exception.getMessage());

        verify(userRepository, times(1)).findById(nonExistentUserId);
        verify(profileRepository, never()).findByUserId(anyInt());
    }

    @Test
    void execute_UserExistsButHasNoProfiles_ThrowsNoProfilesFoundException() {
        Integer userId = 1;
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(profileRepository.findByUserId(userId)).thenReturn(Collections.emptyList());

        NoProfilesFoundException exception = assertThrows(NoProfilesFoundException.class, () -> {
            getUserProfilesUseCase.execute(userId);
        });

        assertEquals("El usuario con ID " + userId + " no tiene perfiles asociados.", exception.getMessage());

        verify(userRepository, times(1)).findById(userId);
        verify(profileRepository, times(1)).findByUserId(userId);
    }
}
