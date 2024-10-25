package com.tpi.server.application.services.deviceConfiguration;

import com.tpi.server.domain.enums.AlertType;
import com.tpi.server.domain.interfaces.IConfigurationService;
import com.tpi.server.domain.models.DeviceConfiguration;
import com.tpi.server.infrastructure.repositories.DeviceConfigurationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConfigurationServiceImpl implements IConfigurationService {

    private final DeviceConfigurationRepository deviceConfigurationRepository;

    @Override
    public DeviceConfiguration getDeviceConfiguration(String deviceId) {
        DeviceConfiguration config = deviceConfigurationRepository.findByDeviceId(deviceId);
        if (config == null) {
            config = deviceConfigurationRepository.save(DeviceConfiguration.builder().deviceId(deviceId).build());
        }
        return config;
    }

    @Override
    public boolean isAlertActive(String deviceId, AlertType alertType) {
        DeviceConfiguration deviceConfig = getDeviceConfiguration(deviceId);

        return switch (alertType) {
            case HighConsumption -> deviceConfig.isHighConsumptionActive();
            case HighTension -> deviceConfig.isHighTensionActive();
            case LowTension -> deviceConfig.isLowTensionActive();
            case EnergyLoss -> deviceConfig.isEnergyLossActive();
            case PeakPowerCurrent -> deviceConfig.isPeakPowerCurrentActive();
            case HighTemperature -> deviceConfig.isHighTemperatureActive();
            case HighHumidity -> deviceConfig.isHighHumidityActive();
            case LostDevice -> deviceConfig.isLostDeviceActive();
            default -> throw new IllegalArgumentException("Tipo de alerta no reconocido: " + alertType);
        };
    }
}
