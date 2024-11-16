package com.tpi.server.user;

import com.tpi.server.application.usecases.user.GetUserDevicesUseCase;
import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.exceptions.NoDevicesFoundException;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
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

class GetUserDevicesUseCaseTest {

    @Mock
    private DeviceRepository deviceRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GetUserDevicesUseCase getUserDevicesUseCase;

    private User user;
    private Device device1;
    private Device device2;
    private List<Device> devices;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = User.builder()
                .id(1)
                .username("usuarioEjemplo")
                .email("usuario@gmail.com")
                .hasCompletedOnboarding(true)
                .build();

        device1 = Device.builder()
                .deviceId("1L")
                .name("Dispositivo 1")
                .user(user)
                .build();

        device2 = Device.builder()
                .deviceId("2L")
                .name("Dispositivo 2")
                .user(user)
                .build();

        devices = Arrays.asList(device1, device2);
    }

    @Test
    void execute_UserExistsWithDevices_ReturnsDevices() {
        Integer userId = 1;
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(deviceRepository.findByUserId(userId)).thenReturn(devices);

        List<Device> result = getUserDevicesUseCase.execute(userId);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.containsAll(devices));

        verify(userRepository, times(1)).findById(userId);
        verify(deviceRepository, times(1)).findByUserId(userId);
    }

    @Test
    void execute_UserDoesNotExist_ThrowsUserNotFoundException() {
        Integer nonExistentUserId = 2;
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            getUserDevicesUseCase.execute(nonExistentUserId);
        });

        assertEquals("Usuario con ID " + nonExistentUserId + " no existe.", exception.getMessage());

        verify(userRepository, times(1)).findById(nonExistentUserId);
        verify(deviceRepository, never()).findByUserId(anyInt());
    }

    @Test
    void execute_UserExistsButHasNoDevices_ThrowsNoDevicesFoundException() {
        Integer userId = 1;
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(deviceRepository.findByUserId(userId)).thenReturn(Collections.emptyList());

        NoDevicesFoundException exception = assertThrows(NoDevicesFoundException.class, () -> {
            getUserDevicesUseCase.execute(userId);
        });

        assertEquals("El usuario con ID " + userId + " no tiene dispositivos asociados.", exception.getMessage());

        verify(userRepository, times(1)).findById(userId);
        verify(deviceRepository, times(1)).findByUserId(userId);
    }
}
