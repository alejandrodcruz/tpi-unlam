package com.tpi.server.infrastructure.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateDeviceConfigurationRequest {
    private String deviceId;
    private boolean highConsumptionActive;
    private double highConsumptionValue;
    private boolean highTensionActive;
    private double highTensionValue;
    private boolean lowTensionActive;
    private double lowTensionValue;
    private boolean energyLossActive;
    private boolean peakPowerCurrentActive;
    private double peakPowerCurrentValue;
    private boolean highTemperatureActive;
    private double highTemperatureValue;
    private boolean highHumidityActive;
    private double highHumidityValue;
    private boolean lostDeviceActive;
}
