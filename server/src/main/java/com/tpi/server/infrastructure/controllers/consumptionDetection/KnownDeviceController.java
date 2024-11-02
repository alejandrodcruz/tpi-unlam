package com.tpi.server.infrastructure.controllers.consumptionDetection;

import com.tpi.server.application.usecases.consumptionDetection.GetKnownDevicesUseCase;
import com.tpi.server.application.usecases.consumptionDetection.SaveKnownDeviceUseCase;
import com.tpi.server.domain.models.KnownDevice;
import com.tpi.server.infrastructure.dtos.KnownDeviceDTO;
import com.tpi.server.infrastructure.mappers.KnownDeviceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/known-devices")
@RequiredArgsConstructor
public class KnownDeviceController {

    private final SaveKnownDeviceUseCase saveKnownDeviceUseCase;
    private final GetKnownDevicesUseCase getKnownDevicesUseCase;
    private final KnownDeviceMapper knownDeviceMapper;

    @PostMapping
    public ResponseEntity<KnownDeviceDTO> saveKnownDevice(@RequestBody KnownDeviceDTO knownDeviceDTO) {
        KnownDevice knownDevice = knownDeviceMapper.toEntity(knownDeviceDTO);
        KnownDevice savedDevice = saveKnownDeviceUseCase.execute(knownDevice);
        return ResponseEntity.ok(knownDeviceMapper.toDTO(savedDevice));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<KnownDeviceDTO>> getKnownDevices(@PathVariable Integer userId) {
        List<KnownDevice> knownDevices = getKnownDevicesUseCase.execute(userId);
        List<KnownDeviceDTO> knownDeviceDTOs = knownDevices.stream()
                .map(knownDeviceMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(knownDeviceDTOs);
    }
}
