package com.tpi.server.infrastructure.controllers.alert;

import com.tpi.server.application.usecases.alert.AlertUseCase;
import com.tpi.server.infrastructure.dtos.AlertByDeviceRequest;
import com.tpi.server.infrastructure.dtos.AlertResponse;
import com.tpi.server.infrastructure.exceptions.AlertNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@Controller
@RestController
@RequestMapping("/alert")
public class AlertController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private final AlertUseCase alertUseCase;

    @PostMapping(value = "getUserAlerts")
    public ResponseEntity<?> getUserAlerts(@RequestBody AlertByDeviceRequest deviceId) {
        try {
            List<AlertResponse> alerts = alertUseCase.getUserAlertsByDeviceId(deviceId.getDeviceId());
            return ResponseEntity.ok(alerts);
        } catch (AlertNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + ex.getMessage());
        }
    }

}
