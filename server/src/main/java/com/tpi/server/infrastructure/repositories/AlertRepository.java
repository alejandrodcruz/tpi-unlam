package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.enums.AlertType;
import com.tpi.server.domain.models.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findAllByDeviceIdOrderByDateDesc(String deviceId);
    boolean existsByTypeAndDeviceIdAndDateAfter(AlertType type, String deviceId, Date date);
    List<Alert> findAll();
}
