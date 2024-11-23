package com.tpi.server.domain.enums;

import lombok.Getter;

@Getter
public enum AlertType {
    EnergyLoss("Interrupción total del suministro eléctrico.", ""),
    HighConsumption("Exceso de consumo.", "Watts"),
    LostDevice("Pérdida de conexión con el dispositivo.", ""),
    LowTension("Baja de tensión, el voltaje en la red es inferior al rango normal.", "V"),
    HighTension("Alta tensión, el voltaje en la red es superior al rango normal.", "V"),
    HighHumidity("Humedad alta.", "g/m3"),
    PeakPowerCurrent("Detectamos un pico de Corriente.", "Amp"),
    HighTemperature("Detectamos alta temperatura.", "°C");

    private final String message;
    private final String unit;

    AlertType(String message, String unit) {
        this.message = message;
        this.unit = unit;
    }

}
