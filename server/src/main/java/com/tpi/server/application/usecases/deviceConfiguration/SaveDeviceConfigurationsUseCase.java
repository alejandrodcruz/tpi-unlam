package com.tpi.server.application.usecases.deviceConfiguration;

import com.tpi.server.domain.models.DeviceConfiguration;
import com.tpi.server.infrastructure.repositories.DeviceConfigurationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SaveDeviceConfigurationsUseCase {

    private final DeviceConfigurationRepository deviceConfigurationRepository;

    public DeviceConfiguration execute(DeviceConfiguration device) {
        return deviceConfigurationRepository.save(device);
    }
}