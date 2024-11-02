package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.models.KnownDevice;

import java.util.List;

public interface KnownDeviceRepository {
    KnownDevice save(KnownDevice knownDevice);
    List<KnownDevice> findByUserId(Integer userId);
    List<KnownDevice> findByPowerConsumptionRange(double minPower, double maxPower, Integer userId);
}