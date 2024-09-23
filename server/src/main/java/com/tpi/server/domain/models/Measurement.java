package com.tpi.server.domain.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Measurement {
    private String deviceId;
    private double voltage;
    private double current;
    private double power;
    private double energy;
    private double temperature;
    private double humidity;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private String timestamp;
}
