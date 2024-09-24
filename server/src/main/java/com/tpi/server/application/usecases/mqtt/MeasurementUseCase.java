package com.tpi.server.application.usecases.mqtt;

import com.tpi.server.domain.models.Measurement;
import com.tpi.server.infrastructure.repositories.MeasurementRepository;
import org.springframework.stereotype.Component;

@Component
public class MeasurementUseCase {

    private final MeasurementRepository measurementRepository;

    public MeasurementUseCase(MeasurementRepository measurementRepository) {
        this.measurementRepository = measurementRepository;
    }

    public void processMeasurement(Measurement measurement) {
        measurementRepository.save(measurement);
    }
}