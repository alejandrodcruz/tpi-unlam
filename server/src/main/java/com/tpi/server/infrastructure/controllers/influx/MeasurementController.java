package com.tpi.server.infrastructure.controllers.influx;

import com.tpi.server.application.usecases.influx.GetTotalEnergyConsumptionUseCase;
import com.tpi.server.application.usecases.influx.GetUserMeasurementsUseCase;
import com.tpi.server.domain.models.Measurement;
import com.tpi.server.domain.models.TotalEnergyResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/measurements")
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
            @RequestParam Integer userId,
            @RequestParam List<String> fields,
            @RequestParam(defaultValue = "1h") String timeRange
    ) {
        return getUserMeasurementsUseCase.execute(userId, fields, timeRange);
    }

    @GetMapping("/total-energy")
    public TotalEnergyResponse getTotalEnergyConsumption(
            @RequestParam Integer userId,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam(required = false) String deviceId
    ) {
        double totalEnergy = getTotalEnergyConsumptionUseCase.execute(userId, startTime, endTime, deviceId);
        return new TotalEnergyResponse(totalEnergy);
    }
}
