package com.tpi.server.application.usecases.influx;

import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.DeviceDetails;
import com.tpi.server.domain.models.TotalEnergyDetailedResponse;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.exceptions.InvalidDataException;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import com.tpi.server.infrastructure.repositories.MeasurementRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetTotalEnergyConsumptionUseCase {

    private final MeasurementRepository measurementRepository;
    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate = 5000)
    public void sendTotalEnergyConsumption() {

        Integer userId = 1;
        String startTime = new Date().toString();
        String endTime = new Date().toString();
        String deviceId = "blah";

        //TotalEnergyDetailedResponse data = execute(userId, startTime, endTime, deviceId);

        //messagingTemplate.convertAndSend("/topic/consume", data);
    }

    public GetTotalEnergyConsumptionUseCase(MeasurementRepository measurementRepository,
                                            UserRepository userRepository,
                                            DeviceRepository deviceRepository) {
        this.measurementRepository = measurementRepository;
        this.userRepository = userRepository;
        this.deviceRepository = deviceRepository;
    }

    @Transactional
    public TotalEnergyDetailedResponse execute(Integer userId, String startTime, String endTime, String deviceId) {

        validateTimeRange(startTime, endTime);

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new InvalidDataException("El usuario con ID " + userId + " no existe.");
        }

        Set<Device> devices = user.getDevices();

        if (devices == null || devices.isEmpty()) {
            throw new InvalidDataException("El usuario con ID " + userId + " no tiene dispositivos asociados.");
        }

        if (deviceId != null && !deviceId.isEmpty()) {
            boolean ownsDevice = devices.stream()
                    .anyMatch(device -> device.getDeviceId().equals(deviceId));
            if (!ownsDevice) {
                throw new InvalidDataException("El dispositivo con ID " + deviceId + " no pertenece al usuario con ID " + userId + ".");
            }
            double totalEnergy = measurementRepository.getTotalEnergyConsumption(
                    Collections.singletonList(deviceId), startTime, endTime, deviceId);

            String deviceName = deviceRepository.findById(deviceId)
                    .map(Device::getName)
                    .orElse("Unknown Device");

            return new TotalEnergyDetailedResponse(totalEnergy,
                    List.of(new DeviceDetails(deviceId, totalEnergy, deviceName)));
        } else {
            List<String> deviceIds = devices.stream()
                    .map(Device::getDeviceId)
                    .collect(Collectors.toList());

            Map<String, Double> devicesDetailsMap = measurementRepository.getTotalEnergyConsumptionPerDevice(
                    deviceIds, startTime, endTime);

            double totalEnergy = devicesDetailsMap.values().stream()
                    .mapToDouble(Double::doubleValue)
                    .sum();

            List<DeviceDetails> devicesDetails = devicesDetailsMap.entrySet().stream()
                    .map(entry -> {
                        String name = deviceRepository.findById(entry.getKey())
                                .map(Device::getName)
                                .orElse("Unknown Device");
                        return new DeviceDetails(entry.getKey(), entry.getValue(), name);
                    })
                    .collect(Collectors.toList());

            return new TotalEnergyDetailedResponse(totalEnergy, devicesDetails);
        }
    }

    private void validateTimeRange(String startTime, String endTime) {
        try {
            Instant start = Instant.parse(startTime);
            Instant end = Instant.parse(endTime);
            if (start.isAfter(end)) {
                throw new InvalidDataException("El tiempo de inicio no puede ser posterior al tiempo de fin.");
            }
        } catch (DateTimeParseException ex) {
            throw new InvalidDataException("Las fechas deben estar en formato ISO-8601, por ejemplo, '2023-10-10T10:00:00Z'.");
        }
    }
}