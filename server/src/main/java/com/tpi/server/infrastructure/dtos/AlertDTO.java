package com.tpi.server.infrastructure.dtos;

import com.tpi.server.domain.enums.AlertType;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AlertDTO {
    private String deviceId;
    private AlertType type;
    private String date;
    private String name;
    private String message;
    private double value;
}
