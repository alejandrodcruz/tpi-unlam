package com.tpi.server.domain.models;

import com.tpi.server.infrastructure.utils.EnergyCostCalculator;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TotalEnergyDetailedResponse {
    private double totalEnergy;
    private double energyCost;  // Variable de costo
    private String deviceId; // Solo cuando se filtra por deviceId
    private List<DeviceDetails> devicesDetails;

    public TotalEnergyDetailedResponse(double totalEnergy) {
        this.totalEnergy = totalEnergy;
        this.energyCost = EnergyCostCalculator.calculateEnergyCost(totalEnergy);
    }

    public TotalEnergyDetailedResponse(double totalEnergy, String deviceId) {
        this.totalEnergy = totalEnergy;
        this.deviceId = deviceId;
        this.energyCost = EnergyCostCalculator.calculateEnergyCost(totalEnergy);
    }

    public TotalEnergyDetailedResponse(double totalEnergy, List<DeviceDetails> devicesDetails) {
        this.totalEnergy = totalEnergy;
        this.devicesDetails = devicesDetails;
        this.energyCost = EnergyCostCalculator.calculateEnergyCost(totalEnergy);
    }
}
