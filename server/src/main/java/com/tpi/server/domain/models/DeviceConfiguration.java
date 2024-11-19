package com.tpi.server.domain.models;

import com.tpi.server.domain.enums.AlertType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.EnumMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "device_configuration")
public class DeviceConfiguration {

    @Id
    @GeneratedValue
    private Long id;

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