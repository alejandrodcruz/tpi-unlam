package com.tpi.server.application.usecases.alert;

import com.tpi.server.application.usecases.mailer.EmailServiceImpl;
import com.tpi.server.domain.models.Alert;
import com.tpi.server.infrastructure.dtos.AlertDTO;
import com.tpi.server.infrastructure.dtos.AlertResponse;
import com.tpi.server.infrastructure.dtos.EmailRequest;
import com.tpi.server.infrastructure.exceptions.AlertNotFoundException;
import com.tpi.server.infrastructure.repositories.AlertRepository;
import com.tpi.server.infrastructure.utils.AlertMessageUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.Calendar;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertUseCase {

    private static final Logger logger = LoggerFactory.getLogger(AlertUseCase.class);

    private final SimpMessagingTemplate messagingTemplate;

    private final AlertRepository alertRepository;

    @Autowired
    private final EmailServiceImpl emailService;

    public void createAlert(AlertDTO alertData) {
        try {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.MINUTE, -10);
            Date tenMinutesAgo = calendar.getTime();

            if (alertRepository.existsByTypeAndDeviceIdAndDateAfter(alertData.getType(), alertData.getDeviceId(), tenMinutesAgo)) {
                logger.trace("Alerta duplicada detectada: no se creará una nueva alerta.");
                return;
            }
            Alert alert = Alert.builder()
                    .type(alertData.getType())
                    .date(new Date())
                    .deviceId(alertData.getDeviceId())
                    .value(alertData.getValue())
                    .name(alertData.getName())
                    .build();
            alertRepository.save(alert);
            logger.trace("Save alerta:{}", alert);

            // Establecer mensaje y enviar a través del WebSocket
            alertData.setMessage(AlertMessageUtils.getAlertMessage(alertData.getType()));
            messagingTemplate.convertAndSend("/topic/alerts", alertData);
            emailService.sendEmail(EmailRequest.builder()
                    .destination(getEmail())
                    .subject("Alaerta dectada")
                    .body(alertData.getMessage())
                    .build());
        } catch (Exception e) {
            logger.error("Error al guardar la alerta: {}", alertData);
            throw new RuntimeException("No se pudo crear la alerta");
        }
    }

    //todo get user email
    private String getEmail() {
        return "nicolas.larsen96@gmail.com";
    }


    public List<AlertResponse> getUserAlertsByDeviceId(String deviceId) throws AlertNotFoundException {
        try {
            List<Alert> alerts = alertRepository.findAllByDeviceIdOrderByDateDesc(deviceId);

            return alerts.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        catch (Exception exception) {
            throw new AlertNotFoundException(deviceId);
        }
    }

    private AlertResponse convertToDTO(Alert alert) {
        return AlertResponse.builder()
                .deviceId(alert.getDeviceId())
                .type(alert.getType())
                .alertMessage(AlertMessageUtils.getAlertMessage(alert.getType()))
                .value(alert.getValue())
                .date(new Date())
                .name(alert.getName())
                .build();
    }
}
