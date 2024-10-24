package com.tpi.server.application.services.deviceConfiguration;

import com.tpi.server.domain.enums.AlertType;
import com.tpi.server.domain.models.DeviceConfiguration;
import com.tpi.server.infrastructure.repositories.DeviceConfigurationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DeviceConfigurationService {

    private final DeviceConfigurationRepository deviceConfigurationRepository;


    public DeviceConfigurationService(DeviceConfigurationRepository deviceConfigurationRepository) {
        this.deviceConfigurationRepository = deviceConfigurationRepository;
    }

    public boolean isAlertActive(String deviceId, AlertType alertType) {
        DeviceConfiguration deviceConfig = deviceConfigurationRepository.findByDeviceId(deviceId);
        if (deviceConfig == null) {
            throw new EntityNotFoundException("No se encontró la configuración para el deviceId: " + deviceId);
        }

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
