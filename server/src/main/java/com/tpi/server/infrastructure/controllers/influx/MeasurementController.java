package com.tpi.server.infrastructure.controllers.influx;

import com.tpi.server.application.usecases.influx.GetUserMeasurementsUseCase;
import com.tpi.server.domain.models.Measurement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/measurements")
public class MeasurementController {

    private final GetUserMeasurementsUseCase getUserMeasurementsUseCase;

    public MeasurementController(GetUserMeasurementsUseCase getUserMeasurementsUseCase) {
        this.getUserMeasurementsUseCase = getUserMeasurementsUseCase;
    }

    @GetMapping
    public List<Measurement> getUserMeasurements(
            @RequestParam Integer userId,
            @RequestParam List<String> fields,
            @RequestParam(defaultValue = "1h") String timeRange
    ) {
        System.out.println("Entrando a getUserMeasurements en MeasurementController con userId: " + userId);

        // Llamar al caso de uso con el userId proporcionado
        return getUserMeasurementsUseCase.execute(userId, fields, timeRange);
    }
}
