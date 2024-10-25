package com.tpi.server.domain.models;

import com.tpi.server.infrastructure.utils.EnergyCostCalculator;
import lombok.Data;

@Data
public class DeviceDetails {
    private String deviceId;
    private double totalEnergy;
    private double energyCost;

    public DeviceDetails(String deviceId, double totalEnergy) {
        this.deviceId = deviceId;
        this.totalEnergy = totalEnergy;
        this.energyCost = EnergyCostCalculator.calculateEnergyCost(totalEnergy);
    }
}