package com.tpi.server.application.usecases.deviceConfiguration;

import com.tpi.server.domain.models.DeviceConfiguration;
import com.tpi.server.infrastructure.repositories.DeviceConfigurationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteDeviceConfigurationsUseCase {

    private final DeviceConfigurationRepository deviceConfigurationRepository;

    public void execute(DeviceConfiguration deviceConfig) {
        deviceConfigurationRepository.delete(deviceConfig);
    }
}