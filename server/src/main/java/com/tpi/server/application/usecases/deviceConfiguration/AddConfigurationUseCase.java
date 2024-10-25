package com.tpi.server.application.usecases.deviceConfiguration;

import com.tpi.server.application.services.deviceConfiguration.ConfigurationServiceImpl;
import com.tpi.server.domain.enums.AlertType;
import com.tpi.server.domain.models.DeviceConfiguration;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AddConfigurationUseCase {

    private final ConfigurationServiceImpl configurationService;
    private final SaveDeviceConfigurationsUseCase saveDeviceConfiguration;
    private final DeleteDeviceConfigurationsUseCase deleteDeviceConfiguration;

    public DeviceConfiguration execute(DeviceConfiguration deviceConfiguration) {
        DeviceConfiguration existingConfig = configurationService.getDeviceConfiguration(deviceConfiguration.getDeviceId());

        if (existingConfig != null) {
            deleteDeviceConfiguration.execute(existingConfig);
        }

        return saveDeviceConfiguration.execute(deviceConfiguration);
    }

    public boolean isAlertActive(String deviceId, AlertType alertType) {
        return configurationService.isAlertActive(deviceId, alertType);
    }
}
