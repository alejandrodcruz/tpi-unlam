package com.tpi.server.domain.enums;

import lombok.Getter;

@Getter
public enum AlertType {
    EnergyLoss("Interrupción total del suministro eléctrico."),
    HighConsumption("Exceso de consumo."),
    LostDevice("Pérdida de conexión con el dispositivo."),
    LowTension("Baja de tensión, el voltaje en la red es inferior al rango normal."),
    HighTension("Alta tensión, el voltaje en la red es superior al rango normal."),
    HighHumidity("Humedad alta."),
    PeakPowerCurrent("Detectamos un pico de Corriente."),
    HighTemperature("Detectamos alta temperatura.");

    private final String message;

    AlertType(String message) {
        this.message = message;
    }

}
