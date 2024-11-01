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
import org.mockito.ArgumentCaptor;


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
        String name = "Radio";

        Device device = new Device();
        device.setDeviceId("JJ:BB:CC:DD:EE:CC");
        device.setPairingCode(pairingCode);
        device.setAssigned(false);

        User user = new User();
        user.setId(userId);
        user.setUsername("testUser");

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(device);
        when(userRepository.findById(userId)).thenReturn(java.util.Optional.of(user));
        when(deviceRepository.save(any(Device.class))).thenReturn(device);

        boolean result = devicePairingUseCase.pairDevice(pairingCode, userId, name);

        assertTrue(result);
        assertEquals(user, device.getUser());
        assertTrue(device.isAssigned());
        assertNull(device.getPairingCode());
        assertEquals(name, device.getName());

        ArgumentCaptor<Device> deviceCaptor = ArgumentCaptor.forClass(Device.class);
        verify(deviceRepository, times(1)).save(deviceCaptor.capture());

        Device savedDevice = deviceCaptor.getValue();
        assertEquals(name, savedDevice.getName());
    }

    @Test
    public void pairDeviceDeviceAlreadyAssigned() {
        String pairingCode = "123456";
        Integer userId = 1;
        String name = "Dispositivo Ya Asignado";

        Device device = new Device();
        device.setPairingCode(pairingCode);
        device.setAssigned(true);

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(device);

        boolean result = devicePairingUseCase.pairDevice(pairingCode, userId, name);

        assertFalse(result);

        verify(deviceRepository, never()).save(any(Device.class));
    }

    @Test
    public void pairDeviceInvalidPairingCode() {
        String pairingCode = "invalid-code";
        Integer userId = 1;
        String name = "Dispositivo Inválido";

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(null);

        boolean result = devicePairingUseCase.pairDevice(pairingCode, userId, name);

        assertFalse(result);
        verify(deviceRepository, never()).save(any(Device.class));
    }

    @Test
    public void pairDeviceUserNotFound() {
        String pairingCode = "123456";
        Integer userId = 1;
        String name = "Usuario No Encontrado";

        Device device = new Device();
        device.setPairingCode(pairingCode);
        device.setAssigned(false);

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(device);
        when(userRepository.findById(userId)).thenReturn(java.util.Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            devicePairingUseCase.pairDevice(pairingCode, userId, name); // Llamada con 'name'
        });

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(deviceRepository, never()).save(any(Device.class));
    }
}