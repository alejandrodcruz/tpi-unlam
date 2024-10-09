package com.tpi.server.infrastructure.controllers.alert;

import com.tpi.server.application.usecases.alert.AlertUseCase;
import com.tpi.server.domain.enums.AlertType;
import com.tpi.server.infrastructure.dtos.AlertByDeviceRequest;
import com.tpi.server.infrastructure.dtos.AlertDTO;
import com.tpi.server.infrastructure.dtos.AlertResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@Controller
@RestController
@RequestMapping("/alert")
public class AlertController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private final AlertUseCase alertUseCase;

    @PostMapping(value = "send-alert")
    public ResponseEntity<Void> sendAlert() {
        alertUseCase.createAlert(AlertDTO.builder()
                .date("2024-10-08 14:26:45")
                .deviceId("08:A6:F7:24:71:98")
                .type(AlertType.HighTemperature)
                .value(80)
                .build());
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "getUserAlerts")
    public ResponseEntity<List<AlertResponse>> getUserAlerts(@RequestBody AlertByDeviceRequest deviceId) {
        List<AlertResponse> alerts = alertUseCase.getUserAlertsByDeviceId(deviceId.getDeviceId());
        return ResponseEntity.ok(alerts);
    }

}
