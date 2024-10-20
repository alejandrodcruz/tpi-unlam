package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.models.Measurement;

import java.util.List;
import java.util.Map;

public interface MeasurementRepository {
    void save(Measurement measurement);
    List<Measurement> getMeasurements(List<String> deviceIds, List<String> fields, String timeRange);
    double getTotalEnergyConsumption(List<String> deviceIds, String startTime, String endTime, String deviceId);
    Map<String, Double> getTotalEnergyConsumptionPerDevice(List<String> deviceIds, String startTime, String endTime);

}

