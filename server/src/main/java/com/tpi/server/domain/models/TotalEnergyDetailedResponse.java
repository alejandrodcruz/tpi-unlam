package com.tpi.server.domain.models;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TotalEnergyDetailedResponse {
    private double totalEnergy;
    private double energyCost;  // Variable de costo
    private String deviceId; // Solo cuando se filtra por deviceId
    private Map<String, Double> devicesDetails; // Solo cuando no se filtra por deviceId

    public TotalEnergyDetailedResponse(double totalEnergy) {
        this.totalEnergy = totalEnergy;
        this.energyCost = calculateEnergyCost(totalEnergy);
    }

    public TotalEnergyDetailedResponse(double totalEnergy, String deviceId) {
        this.totalEnergy = totalEnergy;
        this.deviceId = deviceId;
        this.energyCost = calculateEnergyCost(totalEnergy);
    }

    public TotalEnergyDetailedResponse(double totalEnergy, Map<String, Double> devicesDetails) {
        this.totalEnergy = totalEnergy;
        this.devicesDetails = devicesDetails;
        this.energyCost = calculateEnergyCost(totalEnergy);
    }
    // Calcular el costo de energía
    private double calculateEnergyCost(double totalEnergy) {
        if (totalEnergy < 250) { //Tarifa 1
            return totalEnergy * 133;
        } else if (totalEnergy <= 500) { //Tarifa 2
            return totalEnergy * 150;
        } else { // Tarifa 3
            return totalEnergy * 160;
        }
    }
}
