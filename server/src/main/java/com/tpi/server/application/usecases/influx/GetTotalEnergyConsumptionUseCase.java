package com.tpi.server.application.usecases.influx;

import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.DeviceDetails;
import com.tpi.server.domain.models.TotalEnergyDetailedResponse;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import com.tpi.server.infrastructure.repositories.MeasurementRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public TotalEnergyDetailedResponse execute(Integer userId, String startTime, String endTime, String deviceId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return new TotalEnergyDetailedResponse(0.0);
        }

        Set<Device> devices = user.getDevices();

        if (devices == null || devices.isEmpty()) {
            return new TotalEnergyDetailedResponse(0.0);
        }

        if (deviceId != null && !deviceId.isEmpty()) {
            boolean ownsDevice = devices.stream()
                    .anyMatch(device -> device.getDeviceId().equals(deviceId));
            if (!ownsDevice) {
                return new TotalEnergyDetailedResponse(0.0);
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

            // Obtener el consumo total por dispositivo
            Map<String, Double> devicesDetailsMap = measurementRepository.getTotalEnergyConsumptionPerDevice(
                    deviceIds, startTime, endTime);

            double totalEnergy = devicesDetailsMap.values().stream()
                    .mapToDouble(Double::doubleValue)
                    .sum();

            // DeviceDetails con cada deviceId, totalEnergy, energyCost y name
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
}