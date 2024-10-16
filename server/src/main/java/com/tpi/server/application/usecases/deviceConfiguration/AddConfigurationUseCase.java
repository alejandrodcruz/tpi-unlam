package com.tpi.server.application.usecases.deviceConfiguration;

import com.tpi.server.application.usecases.mqtt.MeasurementUseCase;
import com.tpi.server.domain.models.DeviceConfiguration;
import com.tpi.server.infrastructure.repositories.DeviceConfigurationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AddConfigurationUseCase {

    private final DeviceConfigurationRepository deviceConfigurationRepository;

    @Autowired
    private final MeasurementUseCase measurementUseCase;

    public DeviceConfiguration execute(DeviceConfiguration deviceConfiguration) {
        DeviceConfiguration existingConfig = deviceConfigurationRepository.findByDeviceId(deviceConfiguration.getDeviceId());

        if (existingConfig != null) {
            deviceConfigurationRepository.delete(existingConfig);
        }

        DeviceConfiguration savedConfig = deviceConfigurationRepository.save(deviceConfiguration);

        updateAlertConditions(savedConfig);

        return savedConfig;
    }

    private void updateAlertConditions(DeviceConfiguration deviceConfiguration) {
        measurementUseCase.updateAlertConditions(deviceConfiguration);
    }


}
