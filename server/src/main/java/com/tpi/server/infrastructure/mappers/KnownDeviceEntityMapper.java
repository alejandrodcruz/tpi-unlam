package com.tpi.server.infrastructure.mappers;

import com.tpi.server.domain.models.KnownDevice;
import com.tpi.server.domain.models.KnownDeviceEntity;
import org.springframework.stereotype.Component;

@Component
public class KnownDeviceEntityMapper {

    public KnownDevice toDomain(KnownDeviceEntity entity) {
        return KnownDevice.builder()
                .id(entity.getId())
                .name(entity.getName())
                .typicalPowerConsumption(entity.getTypicalPowerConsumption())
                .userId(entity.getUserId())
                .build();
    }

    public KnownDeviceEntity toEntity(KnownDevice domain) {
        return KnownDeviceEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .typicalPowerConsumption(domain.getTypicalPowerConsumption())
                .userId(domain.getUserId())
                .build();
    }
}