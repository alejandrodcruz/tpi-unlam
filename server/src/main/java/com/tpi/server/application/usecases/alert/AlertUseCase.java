package com.tpi.server.application.usecases.alert;

import com.tpi.server.domain.models.Alert;
import com.tpi.server.infrastructure.dtos.AlertDTO;
import com.tpi.server.infrastructure.dtos.AlertResponse;
import com.tpi.server.infrastructure.repositories.AlertRepository;
import com.tpi.server.infrastructure.utils.AlertMessageUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertUseCase {

    private static final Logger logger = LoggerFactory.getLogger(AlertUseCase.class);

    private final SimpMessagingTemplate messagingTemplate;

    private final AlertRepository alertRepository;

    public void createAlert(AlertDTO alertData) {
        try {
            Alert alert = Alert.builder()
                    .type(alertData.getType())
                    .date(alertData.getDate())
                    .deviceId(alertData.getDeviceId())
                    .value(alertData.getValue())
                    .build();
            alertRepository.save(alert);
            logger.trace("Save alerta:{}", alert);
            String message = AlertMessageUtils.getAlertMessage(alertData.getType());
            messagingTemplate.convertAndSend("/topic/alerts", message);
        } catch (Exception e) {
            logger.error("Error al guardar la alerta", e);
            throw new RuntimeException("No se pudo crear la alerta", e);
        }
    }


    public List<AlertResponse> getUserAlertsByDeviceId(String deviceId) {
        List<Alert> alerts = alertRepository.findAllByDeviceIdOrderByDateDesc(deviceId);

        return alerts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private AlertResponse convertToDTO(Alert alert) {
        return AlertResponse.builder()
                .deviceId(alert.getDeviceId())
                .type(alert.getType())
                .alertMessage(AlertMessageUtils.getAlertMessage(alert.getType()))
                .value(alert.getValue())
                .date(alert.getDate())
                .build();
    }
}
