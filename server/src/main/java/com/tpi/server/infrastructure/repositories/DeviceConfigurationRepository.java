package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.models.DeviceConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceConfigurationRepository extends JpaRepository<DeviceConfiguration, Long> {
    DeviceConfiguration findByDeviceId(String deviceId);
}