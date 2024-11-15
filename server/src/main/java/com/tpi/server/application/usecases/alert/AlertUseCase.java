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

    private final DeviceRepository deviceRepository;

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

            // Establecer mensaje y enviar a través del WebSocket
            alertData.setMessage(AlertMessageUtils.getAlertMessage(alertData.getType()));
            String userMail = getEmail(alertData.getDeviceId());
            messagingTemplate.convertAndSend("/topic/alerts", alertData);
            emailService.sendAlertEmail(EmailRequest.builder()
                    .destination(userMail)
                    .subject("Lytics. "+ alertData.getName() + " nueva alerta detectada.")
                    .body(alertData.getName() + ". " + alertData.getMessage())
                    .build());
            alertRepository.save(alert);
            logger.trace("Save alerta:{}", alert);
        }
        catch (GetEmailForAlertException e) {
            throw new GetEmailForAlertException(alertData.getDeviceId());
        }
        catch (Exception e) {
            throw new AlertException(alertData);
        }
    }

    private String getEmail(String deviceId) throws GetEmailForAlertException {
        try {
            Device device = deviceRepository.findDeviceByDeviceId(deviceId);
            return device.getUser().getEmail();
        }
        catch (Exception exception) {
            throw new GetEmailForAlertException(deviceId);
        }
    }

    public List<AlertResponse> getUserAlertsByDeviceId(String deviceId) throws AlertGetUserException {
        try {
            List<Alert> alerts = alertRepository.findAllByDeviceIdOrderByDateDesc(deviceId);

            return alerts.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        catch (Exception exception) {
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
                .build();
    }
}
