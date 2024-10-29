package com.tpi.server.infrastructure.utils;

public class EnergyCostCalculator {
    public static double calculateEnergyCost(double totalEnergy) {
        // Tarifa 1
        if (totalEnergy < 250) {
            return totalEnergy * 133;
        // Tarifa 2
        } else if (totalEnergy <= 500) {
            return totalEnergy * 150;
        // Tarifa 3
        } else {
            return totalEnergy * 160;
        }
    }
}