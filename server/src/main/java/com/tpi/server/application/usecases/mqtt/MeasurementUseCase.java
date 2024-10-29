package com.tpi.server.application.usecases.mqtt;

import com.tpi.server.application.services.deviceConfiguration.ConfigurationServiceImpl;
import com.tpi.server.application.usecases.alert.AlertUseCase;
import com.tpi.server.domain.enums.AlertType;
import com.tpi.server.domain.models.DeviceConfiguration;
import com.tpi.server.domain.models.Measurement;
import com.tpi.server.infrastructure.dtos.AlertDTO;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import com.tpi.server.infrastructure.repositories.MeasurementRepository;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Predicate;

@Component
public class MeasurementUseCase {

    private final MeasurementRepository measurementRepository;
    private final AlertUseCase alertService;
    private final DeviceRepository deviceRepository;
    private final ConfigurationServiceImpl configurationService;

    private final Map<Predicate<Measurement>, AlertType> alertConditions = new HashMap<>();

    public MeasurementUseCase(MeasurementRepository measurementRepository, AlertUseCase alertService, DeviceRepository deviceRepository, ConfigurationServiceImpl configurationService) {
        this.measurementRepository = measurementRepository;
        this.alertService = alertService;
        this.deviceRepository = deviceRepository;
        this.configurationService = configurationService;
        initializeAlertConditions();
    }

    private void initializeAlertConditions() {
        alertConditions.put(m -> m.getVoltage() < 110.0, AlertType.LowTension);
        alertConditions.put(m -> m.getVoltage() > 240.0, AlertType.HighTension);
        alertConditions.put(m -> m.getCurrent() > 15.0, AlertType.PeakPowerCurrent);
        alertConditions.put(m -> m.getPower() > 2400.0, AlertType.HighConsumption);
        alertConditions.put(m -> m.getTemperature() > 50.0, AlertType.HighTemperature);
        alertConditions.put(m -> m.getHumidity() > 80.0, AlertType.HighHumidity);
    }

    public void processMeasurement(Measurement measurement) {
        checkMeasurement(measurement);
        measurementRepository.save(measurement);
    }

    private void checkMeasurement(Measurement measurement) {
        Map<AlertType, Function<Measurement, Double>> alertValueExtractors = Map.of(
                AlertType.LowTension, Measurement::getVoltage,
                AlertType.HighTension, Measurement::getVoltage,
                AlertType.PeakPowerCurrent, Measurement::getCurrent,
                AlertType.HighConsumption, Measurement::getPower,
                AlertType.HighTemperature, Measurement::getTemperature,
                AlertType.HighHumidity, Measurement::getHumidity
        );

        alertConditions.forEach((condition, alertType) -> {
            if (condition.test(measurement)) {
                String deviceId = measurement.getDeviceId();
                if (configurationService.isAlertActive(deviceId, alertType)) {
                    double alertValue = alertValueExtractors.get(alertType).apply(measurement);
                    var deviceOptional = deviceRepository.findById(deviceId).stream().findFirst();

                    deviceOptional.ifPresent(device -> alertService.createAlert(AlertDTO.builder()
                            .type(alertType)
                            .date(measurement.getTimestamp())
                            .value(alertValue)
                            .deviceId(deviceId)
                            .name(device.getName())
                            .build()));
                }
            }
        });
    }

    public void updateAlertConditions(DeviceConfiguration deviceConfiguration) {
        if (deviceConfiguration != null) {
            alertConditions.clear();
            if (deviceConfiguration.isLowTensionActive()) {
                alertConditions.put(m -> m.getVoltage() < deviceConfiguration.getLowTensionValue(), AlertType.LowTension);
            }
            if (deviceConfiguration.isHighTensionActive()) {
                alertConditions.put(m -> m.getVoltage() > deviceConfiguration.getHighTensionValue(), AlertType.HighTension);
            }
            if (deviceConfiguration.isPeakPowerCurrentActive()) {
                alertConditions.put(m -> m.getCurrent() > deviceConfiguration.getPeakPowerCurrentValue(), AlertType.PeakPowerCurrent);
            }
            if (deviceConfiguration.isHighConsumptionActive()) {
                alertConditions.put(m -> m.getPower() > deviceConfiguration.getHighConsumptionValue(), AlertType.HighConsumption);
            }
            if (deviceConfiguration.isHighTemperatureActive()) {
                alertConditions.put(m -> m.getTemperature() > deviceConfiguration.getHighTemperatureValue(), AlertType.HighTemperature);
            }
            if (deviceConfiguration.isHighHumidityActive()) {
                alertConditions.put(m -> m.getHumidity() > deviceConfiguration.getHighHumidityValue(), AlertType.HighHumidity);
            }
        }
    }
}
