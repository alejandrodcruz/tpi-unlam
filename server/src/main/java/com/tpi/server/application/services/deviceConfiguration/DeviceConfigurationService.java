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

        switch (alertType) {
            case HighConsumption:
                return deviceConfig.isHighConsumptionActive();
            case HighTension:
                return deviceConfig.isHighTensionActive();
            case LowTension:
                return deviceConfig.isLowTensionActive();
            case EnergyLoss:
                return deviceConfig.isEnergyLossActive();
            case PeakPowerCurrent:
                return deviceConfig.isPeakPowerCurrentActive();
            case HighTemperature:
                return deviceConfig.isHighTemperatureActive();
            case HighHumidity:
                return deviceConfig.isHighHumidityActive();
            case LostDevice:
                return deviceConfig.isLostDeviceActive();
            default:
                throw new IllegalArgumentException("Tipo de alerta no reconocido: " + alertType);
        }
    }
}
