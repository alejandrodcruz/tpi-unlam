package com.tpi.server.infrastructure.controllers.alert;

import com.tpi.server.application.usecases.alert.AlertUseCase;
import com.tpi.server.domain.enums.AlertType;
import com.tpi.server.infrastructure.dtos.AlertDTO;
import com.tpi.server.infrastructure.utils.AlertMessageUtils;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Date;

@AllArgsConstructor
@Controller
public class AlertController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private final AlertUseCase alertUseCase;

    public void sendConsumptionAlert(AlertType type) {
        String message = AlertMessageUtils.getAlertMessage(type);
        messagingTemplate.convertAndSend("/topic/alerts", message);
    }

    @PostMapping(value = "send-alert")
    public ResponseEntity<Void> sendAlert() {
        alertUseCase.createAlert(AlertDTO.builder()
                .date(new Date())
                .deviceId("08:A6:F7:24:71:98")
                .type(AlertType.HighTemperature)
                .value(80)
                .build());
        return ResponseEntity.ok().build();
    }

}
