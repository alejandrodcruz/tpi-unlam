package com.tpi.server.application.usecases.device;

import com.tpi.server.infrastructure.exceptions.DeviceNotFoundException;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeviceDeleteUseCase {

    private final DeviceRepository deviceRepository;

    @Transactional
    public void deleteDevice(String deviceId) {
        if (!deviceRepository.existsById(deviceId)) {
            throw new DeviceNotFoundException(deviceId);
        }
        deviceRepository.deleteById(deviceId);
    }
}
