package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.models.KnownDeviceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpringDataKnownDeviceRepository extends JpaRepository<KnownDeviceEntity, Long> {
    List<KnownDeviceEntity> findByUserId(Integer userId);
    List<KnownDeviceEntity> findByTypicalPowerConsumptionBetweenAndUserId(double minPower, double maxPower, Integer userId);
}