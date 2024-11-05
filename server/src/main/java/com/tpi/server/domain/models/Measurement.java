package com.tpi.server.domain.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Measurement {
    private String deviceId;
    private String timestamp;
    private Double voltage;
    private Double current;
    private Double power;
    private Double energy;
    private Double temperature;
    private Double humidity;
}