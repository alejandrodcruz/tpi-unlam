package com.tpi.server.application.services.consumptionDetection;

import com.tpi.server.application.usecases.consumptionDetection.ProcessMeasurementUseCase;
import com.tpi.server.domain.models.Measurement;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MqttMeasurementHandler {

    private final ProcessMeasurementUseCase processMeasurementUseCase;

    public void handleIncomingMeasurement(Measurement measurement) {
        processMeasurementUseCase.execute(measurement);
    }
}
