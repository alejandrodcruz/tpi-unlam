package com.tpi.server.application.usecases.alert;

import com.tpi.server.application.usecases.mailer.EmailServiceImpl;
import com.tpi.server.domain.models.Alert;
import com.tpi.server.domain.models.Device;
import com.tpi.server.infrastructure.dtos.AlertDTO;
import com.tpi.server.infrastructure.dtos.AlertResponse;
import com.tpi.server.infrastructure.dtos.EmailRequest;
import com.tpi.server.infrastructure.exceptions.AlertException;
import com.tpi.server.infrastructure.exceptions.AlertGetUserException;
import com.tpi.server.infrastructure.exceptions.GetEmailForAlertException;
import com.tpi.server.infrastructure.repositories.AlertRepository;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import com.tpi.server.infrastructure.utils.AlertMessageUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertUseCase {

    private static final Logger logger = LoggerFactory.getLogger(AlertUseCase.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final AlertRepository alertRepository;
    private final DeviceRepository deviceRepository;
    private final EmailServiceImpl emailService;

    public void createAlert(AlertDTO alertData) {
        try {
            logger.trace("ENTRA AL CREATE ALERT" );
            if (isDuplicateAlert(alertData)) {
                logger.trace("Alerta duplicada detectada: no se creará una nueva alerta.");
                return;
            }
            logger.trace("NO ESTA DUPLICADA" );
            Alert alert = createAlertEntity(alertData);
            logger.trace("Alert creada: {}", alert);
            alertRepository.save(alert);
            logger.trace("Alerta guardada: {}", alert);
            String userMail = getEmail(alertData.getDeviceId());
            logger.trace("Mail enviado: {}", userMail);
            sendAlertNotification(alertData, userMail);
            logger.trace("Notificacion enviada a WS : {}", alert);

        } catch (GetEmailForAlertException e) {
            logger.error("Error al obtener el email para el dispositivo {}: {}", alertData.getDeviceId(), e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Error al crear la alerta para el dispositivo {}: {}", alertData.getDeviceId(), e.getMessage());
            throw new AlertException(alertData);
        }
    }

    private boolean isDuplicateAlert(AlertDTO alertData) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MINUTE, -10);
        Date tenMinutesAgo = calendar.getTime();
        return alertRepository.existsByTypeAndDeviceIdAndDateAfter(alertData.getType(), alertData.getDeviceId(), tenMinutesAgo);
    }

    private Alert createAlertEntity(AlertDTO alertData) {
        return Alert.builder()
                .type(alertData.getType())
                .date(new Date())
                .deviceId(alertData.getDeviceId())
                .value(alertData.getValue())
                .name(alertData.getName())
                .build();
    }

    private void sendAlertNotification(AlertDTO alertData, String userMail) {
        alertData.setMessage(AlertMessageUtils.getAlertMessage(alertData.getType()));
        messagingTemplate.convertAndSend("/topic/alerts", alertData);

        EmailRequest emailRequest = EmailRequest.builder()
                .destination(userMail)
                .subject("Lytics. " + alertData.getName() + " nueva alerta detectada.")
                .body(alertData.getName() + ". " + alertData.getMessage())
                .build();

        //emailService.sendAlertEmail(emailRequest);
    }

    private String getEmail(String deviceId) throws GetEmailForAlertException {
        try {
            Device device = Optional.ofNullable(deviceRepository.findDeviceByDeviceId(deviceId))
                    .orElseThrow(() -> new GetEmailForAlertException(deviceId));
            return device.getUser().getEmail();
        } catch (Exception e) {
            logger.error("Error al obtener el correo para el dispositivo {}: {}", deviceId, e.getMessage());
            throw new GetEmailForAlertException(deviceId);
        }
    }

    public List<AlertResponse> getUserAlertsByDeviceId(String deviceId) throws AlertGetUserException {
        try {
            List<Alert> alerts = alertRepository.findAllByDeviceIdOrderByDateDesc(deviceId);
            return alerts.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener alertas para el dispositivo {}: {}", deviceId, e.getMessage());
            throw new AlertGetUserException(deviceId);
        }
    }

    private AlertResponse convertToDTO(Alert alert) {
        return AlertResponse.builder()
                .deviceId(alert.getDeviceId())
                .type(alert.getType())
                .alertMessage(AlertMessageUtils.getAlertMessage(alert.getType()))
                .value(alert.getValue())
                .date(alert.getDate())
                .name(alert.getName())
                .unit(AlertMessageUtils.getUnit(alert.getType()))
                .build();
    }
}
