package com.tpi.server.infrastructure.utils;

import com.tpi.server.domain.enums.AlertType;

public class AlertMessageUtils {
    public static String getAlertMessage(AlertType type) {
        return switch (type) {
            case EnergyLoss -> "Interrupción total del suministro eléctrico.";
            case HighConsumption -> "Exceso de consumo.";
            case LostDevice -> "Pérdida de conexión con el dispositivo.";
            case LowTension -> "Baja de tensión, el voltaje en la red es inferior al rango normal.";
            case HighTension -> "Alta tensión, el voltaje en la red es superior al rango normal.";
            case HighHumidity -> "Humedad alta.";
            case PeakPowerCurrent -> "Detectamos un pico de Corriente.";
            case HighTemperature -> "Detectamos alta temperatura.";
        };
    }
}
