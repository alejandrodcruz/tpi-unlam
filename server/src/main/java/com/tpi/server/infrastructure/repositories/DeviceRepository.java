package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.models.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String> {
    Device findByPairingCode(String pairingCode);
    List<Device> findByUserId(Integer userId);
    Device findDeviceByDeviceId(String deviceId);
}