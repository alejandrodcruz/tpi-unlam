package com.tpi.server.infrastructure.controllers.influx;

import com.tpi.server.application.usecases.influx.GetTotalEnergyConsumptionUseCase;
import com.tpi.server.application.usecases.influx.GetUserMeasurementsUseCase;
import com.tpi.server.domain.models.Measurement;
import com.tpi.server.domain.models.TotalEnergyDetailedResponse;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/measurements")
@Validated
public class MeasurementController {

    private final GetUserMeasurementsUseCase getUserMeasurementsUseCase;
    private final GetTotalEnergyConsumptionUseCase getTotalEnergyConsumptionUseCase;

    public MeasurementController(GetUserMeasurementsUseCase getUserMeasurementsUseCase,
                                 GetTotalEnergyConsumptionUseCase getTotalEnergyConsumptionUseCase) {
        this.getUserMeasurementsUseCase = getUserMeasurementsUseCase;
        this.getTotalEnergyConsumptionUseCase = getTotalEnergyConsumptionUseCase;
    }

    @GetMapping
    public List<Measurement> getUserMeasurements(
            @RequestParam @NotNull Integer userId,
            @RequestParam @NotEmpty List<String> fields,
            @RequestParam(defaultValue = "1h") String timeRange,
            @RequestParam(required = false) String deviceId
    ) {
        return getUserMeasurementsUseCase.execute(userId, fields, timeRange, deviceId);
    }

    @GetMapping("/total-energy")
    public TotalEnergyDetailedResponse getTotalEnergyConsumption(
            @RequestParam @NotNull Integer userId,
            @RequestParam @NotNull String startTime,
            @RequestParam @NotNull String endTime,
            @RequestParam(required = false) String deviceId
    ) {
        return getTotalEnergyConsumptionUseCase.execute(userId, startTime, endTime, deviceId);
    }

    @PostMapping("/start-energy")
    public ResponseEntity<Map<String, String>> startEnergyUpdates(
            @RequestParam Integer userId,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam(required = false) String deviceId) {

        getTotalEnergyConsumptionUseCase.startEnergyWS(userId, startTime, endTime, deviceId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Energy updates started");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/start-measurements")
    public ResponseEntity<Map<String, String>> startMeasurements(
            @RequestParam @NotNull Integer userId,
            @RequestParam @NotEmpty List<String> fields,
            @RequestParam(defaultValue = "1h") String timeRange,
            @RequestParam(required = false) String deviceId
    ) {
        getUserMeasurementsUseCase.startWS(userId, fields, timeRange, deviceId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Measurents updates started");

        return ResponseEntity.ok(response);
    }


}
