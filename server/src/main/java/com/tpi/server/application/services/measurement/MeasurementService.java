package com.tpi.server.application.services.measurement;

import com.tpi.server.domain.models.Measurement;
import com.tpi.server.infrastructure.exceptions.InvalidDataException;
import com.tpi.server.infrastructure.repositories.MeasurementRepository;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Validated
@RequiredArgsConstructor
public class MeasurementService {

    private final MeasurementRepository measurementRepository;

    public void saveMeasurement(@NotNull Measurement measurement) {
        validateMeasurement(measurement);
        measurementRepository.save(measurement);
    }

    public List<Measurement> getMeasurements(@NotEmpty List<String> deviceIds, @NotEmpty List<String> fields, @NotNull String timeRange) {
        return measurementRepository.getMeasurements(deviceIds, fields, timeRange);
    }

    public double getTotalEnergyConsumption(@NotEmpty List<String> deviceIds, @NotNull String startTime, @NotNull String endTime, String deviceId) {
        validateTimeRange(startTime, endTime);

        Instant start = Instant.parse(startTime);
        Instant end = Instant.parse(endTime);
        Instant now = Instant.now();

        Instant oneHourAgo = now.minus(Duration.ofHours(1));
        boolean includesRecentData = end.isAfter(oneHourAgo);

        double totalEnergy = 0.0;

        if (includesRecentData) {
            Instant historicEnd = start.isBefore(oneHourAgo) ? oneHourAgo : start;
            double energyHistoric = 0.0;
            if (start.isBefore(historicEnd)) {
                energyHistoric = measurementRepository.getTotalEnergyConsumption(
                        deviceIds, startTime, historicEnd.toString(), deviceId);
            }

            Instant realtimeStart = start.isAfter(oneHourAgo) ? start : oneHourAgo;
            double energyRealtime = measurementRepository.getTotalEnergyConsumption(
                    deviceIds, realtimeStart.toString(), endTime, deviceId);

            totalEnergy = energyRealtime + energyHistoric;
        } else {
            totalEnergy = measurementRepository.getTotalEnergyConsumption(deviceIds, startTime, endTime, deviceId);
        }

        return totalEnergy;
    }

    public Map<String, Double> getTotalEnergyConsumptionPerDevice(@NotEmpty List<String> deviceIds, @NotNull String startTime, @NotNull String endTime) {
        validateTimeRange(startTime, endTime);

        Instant start = Instant.parse(startTime);
        Instant end = Instant.parse(endTime);
        Instant now = Instant.now();

        Instant oneHourAgo = now.minus(Duration.ofHours(1));
        boolean includesRecentData = end.isAfter(oneHourAgo);

        Map<String, Double> deviceConsumption = new HashMap<>();

        if (includesRecentData) {
            Instant historicEnd = start.isBefore(oneHourAgo) ? oneHourAgo : start;
            if (start.isBefore(historicEnd)) {
                Map<String, Double> historicConsumption = measurementRepository.getTotalEnergyConsumptionPerDevice(
                        deviceIds, startTime, historicEnd.toString());
                deviceConsumption.putAll(historicConsumption);
            }

            Instant realtimeStart = start.isAfter(oneHourAgo) ? start : oneHourAgo;
            Map<String, Double> realtimeConsumption = measurementRepository.getTotalEnergyConsumptionPerDevice(
                    deviceIds, realtimeStart.toString(), endTime);

            realtimeConsumption.forEach((device, energy) ->
                    deviceConsumption.merge(device, energy, Double::sum)
            );
        } else {
            Map<String, Double> consumption = measurementRepository.getTotalEnergyConsumptionPerDevice(deviceIds, startTime, endTime);
            deviceConsumption.putAll(consumption);
        }

        return deviceConsumption;
    }

    // Funciones para validar
    private void validateMeasurement(Measurement measurement) {
        if (measurement == null) {
            throw new InvalidDataException("Measurement cannot be null");
        }
    }

    private void validateTimeRange(String startTime, String endTime) {
        Instant start = Instant.parse(startTime);
        Instant end = Instant.parse(endTime);
        if (start.isAfter(end)) {
            throw new InvalidDataException("Start time cannot be after end time");
        }
    }
}