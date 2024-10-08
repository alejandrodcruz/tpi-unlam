package com.tpi.server.application.usecases.alert;

import com.tpi.server.domain.enums.AlertType;
import com.tpi.server.domain.models.Alert;
import com.tpi.server.infrastructure.dtos.AlertDTO;
import com.tpi.server.infrastructure.repositories.AlertRepository;
import com.tpi.server.infrastructure.utils.AlertMessageUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;

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
                    .date(new Date())
                    .deviceId(alertData.getDeviceId())
                    .value(alertData.getValue())
                    .build();
            alertRepository.save(alert);
            logger.trace("Save alerta:{}", alert);
            System.out.println("Entro con type:"+ alertData.getType());
            String message = AlertMessageUtils.getAlertMessage(alertData.getType());
            System.out.println("El mensaje:"+ message);
            messagingTemplate.convertAndSend("/topic/alerts", message);
        } catch (Exception e) {
            logger.error("Error al guardar la alerta", e);
            throw new RuntimeException("No se pudo crear la alerta", e);
        }
    }
}
