package com.tpi.server.application.usecases.device;

import com.tpi.server.domain.models.Device;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DeviceRegistrationUseCase {

    private final DeviceRepository deviceRepository;

    public void registerDevice(String deviceId, String pairingCode) {
        Device device = new Device();
        device.setDeviceId(deviceId);
        device.setPairingCode(pairingCode);
        device.setAssigned(false);
        deviceRepository.save(device);
    }
}
