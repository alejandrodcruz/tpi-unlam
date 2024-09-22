package com.tpi.server.infrastructure.dtos;

import lombok.Data;

@Data
public class DeviceRegistrationRequest {
    private String deviceId;
    private String pairingCode;
}