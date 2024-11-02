package com.tpi.server.domain.models;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnownDevice {
    private Long id;
    private String name;
    private double typicalPowerConsumption;
    private Integer userId;
}
