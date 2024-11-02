package com.tpi.server.infrastructure.mappers;

import com.tpi.server.domain.models.KnownDevice;
import com.tpi.server.infrastructure.dtos.KnownDeviceDTO;
import org.springframework.stereotype.Component;

@Component
public class KnownDeviceMapper {

    public KnownDevice toEntity(KnownDeviceDTO dto) {
        return KnownDevice.builder()
                .id(dto.getId())
                .name(dto.getName())
                .typicalPowerConsumption(dto.getTypicalPowerConsumption())
                .userId(dto.getUserId())
                .build();
    }

    public KnownDeviceDTO toDTO(KnownDevice entity) {
        return KnownDeviceDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .typicalPowerConsumption(entity.getTypicalPowerConsumption())
                .userId(entity.getUserId())
                .build();
    }
}
