package com.tpi.server.infrastructure.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnownDeviceDTO {
    private Long id;
    private String name;
    private double typicalPowerConsumption;
    private Integer userId;
}