package com.tpi.server.infrastructure.controllers.device;

import com.tpi.server.application.usecases.user.GetUserDevicesUseCase;
import com.tpi.server.application.usecases.device.DevicePairingUseCase;
import com.tpi.server.application.usecases.device.DeviceRegistrationUseCase;
import com.tpi.server.domain.models.Device;
import com.tpi.server.infrastructure.dtos.DevicePairingRequest;
import com.tpi.server.infrastructure.dtos.DeviceRegistrationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceRegistrationUseCase deviceRegistrationUseCase;
    private final DevicePairingUseCase devicePairingUseCase;
    private final GetUserDevicesUseCase getUserDevicesUseCase;

    @PostMapping("/register-device")
    public ResponseEntity<String> registerDevice(@RequestBody DeviceRegistrationRequest request) {
        deviceRegistrationUseCase.registerDevice(request.getDeviceId(), request.getPairingCode());
        return ResponseEntity.ok("Dispositivo registrado con código de emparejamiento.");
    }

    @PostMapping("/pair-device")
    public ResponseEntity<String> pairDevice(@RequestBody DevicePairingRequest request) {
        boolean success = devicePairingUseCase.pairDevice(request.getPairingCode(), request.getUserId());
        if (success) {
            return ResponseEntity.ok("Dispositivo asociado al usuario.");
        } else {
            return ResponseEntity.badRequest().body("Código de emparejamiento inválido o ya utilizado.");
        }
    }

    @GetMapping("/devices/user/{userId}")
    public List<Device> getDevicesByUser(@PathVariable Integer userId) {
        return getUserDevicesUseCase.execute(userId);
    }
}
