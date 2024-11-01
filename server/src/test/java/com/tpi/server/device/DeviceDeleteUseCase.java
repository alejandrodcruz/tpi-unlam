package com.tpi.server.device;

import com.tpi.server.application.usecases.device.DeviceDeleteUseCase;
import com.tpi.server.infrastructure.exceptions.DeviceNotFoundException;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeviceDeleteUseCaseTest {

    @Mock
    private DeviceRepository deviceRepository;

    @InjectMocks
    private DeviceDeleteUseCase deviceDeleteUseCase;

    private final String existingDeviceId = "deviceDelete";
    private final String nonExistingDeviceId = "deviceNotFound";

    @Test
    void deleteDeviceSuccess() {
        when(deviceRepository.existsById(existingDeviceId)).thenReturn(true);

        assertDoesNotThrow(() -> deviceDeleteUseCase.deleteDevice(existingDeviceId));

        verify(deviceRepository, times(1)).deleteById(existingDeviceId);
    }

    @Test
    void deleteDeviceNotFound() {
        when(deviceRepository.existsById(nonExistingDeviceId)).thenReturn(false);

        DeviceNotFoundException exception = assertThrows(DeviceNotFoundException.class, () -> {
            deviceDeleteUseCase.deleteDevice(nonExistingDeviceId);
        });

        assertEquals("Dispositivo con ID 'deviceNotFound' no encontrado.", exception.getMessage());
        verify(deviceRepository, never()).deleteById(anyString());
    }
}
