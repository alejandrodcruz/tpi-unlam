package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.models.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String> {
    Device findByPairingCode(String pairingCode);
}