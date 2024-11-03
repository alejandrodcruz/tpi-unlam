package com.tpi.server.infrastructure.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeviceResponseDTO {
    private String deviceId;
    private String pairingCode;
    private boolean assigned;
    private String name;
    private double estimatedConsume;
}