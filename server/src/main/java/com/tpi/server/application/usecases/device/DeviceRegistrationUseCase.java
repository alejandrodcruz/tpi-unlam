package com.tpi.server.application.usecases.device;

import com.tpi.server.domain.models.Device;
import com.tpi.server.infrastructure.exceptions.DeviceAlreadyExistsException;
import com.tpi.server.infrastructure.exceptions.InvalidDataException;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DeviceRegistrationUseCase {

    private final DeviceRepository deviceRepository;

    public void registerDevice(String deviceId, String pairingCode) {
        if (deviceId == null || deviceId.trim().isEmpty()) {
            throw new InvalidDataException("El deviceId no puede ser nulo o vacío.");
        }

        if (pairingCode == null || pairingCode.trim().isEmpty()) {
            throw new InvalidDataException("El pairingCode no puede ser nulo o vacío.");
        }
        if (deviceRepository.existsById(deviceId)) {
            throw new DeviceAlreadyExistsException(deviceId);
        }

        // Crear y guardar el nuevo dispositivo
        Device device = new Device();
        device.setDeviceId(deviceId);
        device.setPairingCode(pairingCode);
        device.setAssigned(false);
        deviceRepository.save(device);
    }
}