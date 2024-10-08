package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.models.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    Alert findAlertsByDeviceId(String deviceId);
}
