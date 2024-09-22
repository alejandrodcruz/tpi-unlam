package com.tpi.server.device;

import com.tpi.server.application.usecases.device.DeviceRegistrationUseCase;
import com.tpi.server.domain.models.Device;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class DeviceRegistrationUseCaseTest {

    @Mock
    private DeviceRepository deviceRepository;

    @InjectMocks
    private DeviceRegistrationUseCase deviceRegistrationUseCase;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void registerDeviceSuccess() {
        String deviceId = "JJ:BB:CC:DD:EE:CC";
        String pairingCode = "123456";

        Device device = new Device();
        device.setDeviceId(deviceId);
        device.setPairingCode(pairingCode);

        when(deviceRepository.save(any(Device.class))).thenReturn(device);
        deviceRegistrationUseCase.registerDevice(deviceId, pairingCode);
        verify(deviceRepository, times(1)).save(any(Device.class));
    }
}