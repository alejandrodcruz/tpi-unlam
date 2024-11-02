package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.models.KnownDevice;
import com.tpi.server.domain.models.KnownDeviceEntity;
import com.tpi.server.infrastructure.mappers.KnownDeviceEntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class JpaKnownDeviceRepository implements KnownDeviceRepository {

    private final SpringDataKnownDeviceRepository repository;
    private final KnownDeviceEntityMapper mapper;

    @Override
    public KnownDevice save(KnownDevice knownDevice) {
        KnownDeviceEntity entity = mapper.toEntity(knownDevice);
        KnownDeviceEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public List<KnownDevice> findByUserId(Integer userId) {
        return repository.findByUserId(userId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<KnownDevice> findByPowerConsumptionRange(double minPower, double maxPower, Integer userId) {
        return repository.findByTypicalPowerConsumptionBetweenAndUserId(minPower, maxPower, userId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}