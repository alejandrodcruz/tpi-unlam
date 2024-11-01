package com.tpi.server.infrastructure.controllers.device;

import com.tpi.server.application.usecases.device.DeviceDeleteUseCase;
import com.tpi.server.application.usecases.device.DeviceUpdateUseCase;
import com.tpi.server.application.usecases.user.GetUserDevicesUseCase;
import com.tpi.server.application.usecases.device.DevicePairingUseCase;
import com.tpi.server.application.usecases.device.DeviceRegistrationUseCase;
import com.tpi.server.domain.models.Device;
import com.tpi.server.infrastructure.dtos.DevicePairingRequest;
import com.tpi.server.infrastructure.dtos.DeviceRegistrationRequest;
import com.tpi.server.infrastructure.dtos.DeviceResponseDTO;
import com.tpi.server.infrastructure.dtos.DeviceUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceRegistrationUseCase deviceRegistrationUseCase;
    private final DevicePairingUseCase devicePairingUseCase;
    private final GetUserDevicesUseCase getUserDevicesUseCase;
    private final DeviceUpdateUseCase deviceUpdateUseCase;
    private final DeviceDeleteUseCase deviceDeleteUseCase;

    @PostMapping("/register-device")
    public ResponseEntity<String> registerDevice(@RequestBody DeviceRegistrationRequest request) {
        deviceRegistrationUseCase.registerDevice(request.getDeviceId(), request.getPairingCode());
        return ResponseEntity.ok("Dispositivo registrado con código de emparejamiento.");
    }

    @PostMapping("/pair-device")
    public ResponseEntity<Map<String, String>> pairDevice(@RequestBody DevicePairingRequest request) {
        boolean success = devicePairingUseCase.pairDevice(
                request.getPairingCode(),
                request.getUserId(),
                request.getName(),
                request.getAddressId()
        );
        Map<String, String> response = new HashMap<>();
        if (success) {
            response.put("message", "Dispositivo asociado al usuario.");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Código de emparejamiento inválido o ya utilizado.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/devices/user/{userId}")
    public List<Device> getDevicesByUser(@PathVariable Integer userId) {
        return getUserDevicesUseCase.execute(userId);
    }

    @PutMapping("/devices/{deviceId}")
    public ResponseEntity<DeviceResponseDTO> updateDevice(
            @PathVariable String deviceId,
            @RequestBody DeviceUpdateRequest request) {

        Device updatedDevice = deviceUpdateUseCase.updateDevice(deviceId, request.getName());

        DeviceResponseDTO responseDTO = new DeviceResponseDTO();
        responseDTO.setDeviceId(updatedDevice.getDeviceId());
        responseDTO.setPairingCode(updatedDevice.getPairingCode());
        responseDTO.setAssigned(updatedDevice.isAssigned());
        responseDTO.setName(updatedDevice.getName());
        responseDTO.setEstimatedConsume(updatedDevice.getEstimatedConsume());

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/devices/{deviceId}")
    public ResponseEntity<Map<String, String>> deleteDevice(@PathVariable String deviceId) {
        deviceDeleteUseCase.deleteDevice(deviceId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Dispositivo eliminado correctamente.");
        return ResponseEntity.ok(response);
    }
}
