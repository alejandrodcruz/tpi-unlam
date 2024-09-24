package com.tpi.server.device;
import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.User;
import com.tpi.server.application.usecases.device.DevicePairingUseCase;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DevicePairingUseCaseTest {

    @Mock
    private DeviceRepository deviceRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DevicePairingUseCase devicePairingUseCase;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void pairDeviceSuccess() {
        String pairingCode = "123456";
        Integer userId = 1;

        Device device = new Device();
        device.setPairingCode(pairingCode);
        device.setAssigned(false);

        User user = new User();
        user.setId(userId);
        user.setUsername("testUser");

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(device);
        when(userRepository.findById(userId)).thenReturn(java.util.Optional.of(user));

        boolean result = devicePairingUseCase.pairDevice(pairingCode, userId);

        assertTrue(result);
        assertEquals(user, device.getUser());
        assertTrue(device.isAssigned());
        assertNull(device.getPairingCode());

        verify(deviceRepository, times(1)).save(device);
    }

    @Test
    public void pairDeviceDeviceAlreadyAssigned() {
        String pairingCode = "123456";
        Integer userId = 1;

        Device device = new Device();
        device.setPairingCode(pairingCode);
        device.setAssigned(true);

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(device);

        boolean result = devicePairingUseCase.pairDevice(pairingCode, userId);

        assertFalse(result);

        verify(deviceRepository, never()).save(device);
    }

    @Test
    public void pairDeviceInvalidPairingCode() {
        String pairingCode = "invalid-code";
        Integer userId = 1;

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(null);

        boolean result = devicePairingUseCase.pairDevice(pairingCode, userId);

        assertFalse(result);
        verify(deviceRepository, never()).save(any(Device.class));
    }

    @Test
    public void pairDeviceUserNotFound() {
        String pairingCode = "123456";
        Integer userId = 1;

        Device device = new Device();
        device.setPairingCode(pairingCode);
        device.setAssigned(false);

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(device);
        when(userRepository.findById(userId)).thenReturn(java.util.Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            devicePairingUseCase.pairDevice(pairingCode, userId);
        });

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(deviceRepository, never()).save(device);
    }
}