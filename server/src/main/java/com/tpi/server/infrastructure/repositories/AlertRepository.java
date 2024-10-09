package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.models.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findTop20ByDeviceIdOrderByDateDesc(String deviceId);
    List<Alert> getAlertsByDeviceId(String deviceId);
    List<Alert> findAll();
}
