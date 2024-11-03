package com.tpi.server.infrastructure.dtos;

import lombok.Data;

@Data
public class DevicePairingRequest {
    private String pairingCode;
    private Integer userId;
    private String name;
    private Long addressId;
}