package com.tpi.server.domain.models;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TotalEnergyDetailedResponse {
    private double totalEnergy;
    private String deviceId; // Solo cuando se filtra por deviceId
    private Map<String, Double> devicesDetails; // Solo cuando no se filtra por deviceId

    public TotalEnergyDetailedResponse(double totalEnergy) {
        this.totalEnergy = totalEnergy;
    }

    public TotalEnergyDetailedResponse(double totalEnergy, String deviceId) {
        this.totalEnergy = totalEnergy;
        this.deviceId = deviceId;
    }

    public TotalEnergyDetailedResponse(double totalEnergy, Map<String, Double> devicesDetails) {
        this.totalEnergy = totalEnergy;
        this.devicesDetails = devicesDetails;
    }
}
