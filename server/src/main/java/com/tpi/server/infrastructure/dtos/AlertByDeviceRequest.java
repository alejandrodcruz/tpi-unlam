package com.tpi.server.infrastructure.dtos;

import com.tpi.server.domain.enums.AlertType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AlertByDeviceRequest {
    private String deviceId;
}
