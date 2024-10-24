package com.tpi.server.application.usecases.mqtt;

import com.tpi.server.application.services.deviceConfiguration.DeviceConfigurationService;
import com.tpi.server.application.usecases.alert.AlertUseCase;
import com.tpi.server.domain.enums.AlertType;
import com.tpi.server.domain.models.DeviceConfiguration;
import com.tpi.server.domain.models.Measurement;
import com.tpi.server.infrastructure.dtos.AlertDTO;
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
    private final DeviceConfigurationService deviceConfigurationService;

    private final Map<Predicate<Measurement>, AlertType> alertConditions = new HashMap<>();

    public MeasurementUseCase(MeasurementRepository measurementRepository, AlertUseCase alertService, DeviceConfigurationService deviceConfigurationService) {
        this.measurementRepository = measurementRepository;
        this.alertService = alertService;
        this.deviceConfigurationService = deviceConfigurationService;
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
                // Verificar si la alerta está activa
                String deviceId = measurement.getDeviceId();
                if (deviceConfigurationService.isAlertActive(deviceId, alertType)) {
                    double alertValue = alertValueExtractors.get(alertType).apply(measurement);

                    alertService.createAlert(AlertDTO.builder()
                            .type(alertType)
                            .date(measurement.getTimestamp())
                            .value(alertValue)
                            .deviceId(deviceId)
                            .build());
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
