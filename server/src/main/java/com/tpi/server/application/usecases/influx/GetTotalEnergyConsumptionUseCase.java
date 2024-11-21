package com.tpi.server.application.usecases.influx;

import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.DeviceDetails;
import com.tpi.server.domain.models.TotalEnergyDetailedResponse;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.exceptions.DeviceNotOwnedByUserException;
import com.tpi.server.infrastructure.exceptions.InvalidDataException;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import com.tpi.server.infrastructure.repositories.MeasurementRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GetTotalEnergyConsumptionUseCase {

    private final MeasurementRepository measurementRepository;
    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;

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

        User user = getUserById(userId);
        Set<Device> devices = getUserDevices(user);

        if (deviceId != null && !deviceId.trim().isEmpty()) {
            return getTotalEnergyForSingleDevice(userId, startTime, endTime, deviceId, devices);
        } else {
            return getTotalEnergyForAllDevices(startTime, endTime, devices);
        }
    }

    private User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    private Set<Device> getUserDevices(User user) {
        return Optional.ofNullable(user.getDevices())
                .filter(devices -> !devices.isEmpty())
                .orElseThrow(() -> new InvalidDataException("El usuario con ID " + user.getId() + " no tiene dispositivos asociados."));
    }

    private TotalEnergyDetailedResponse getTotalEnergyForSingleDevice(Integer userId, String startTime, String endTime,
                                                                      String deviceId, Set<Device> devices) {

        Device device = devices.stream()
                .filter(dev -> dev.getDeviceId().equals(deviceId))
                .findFirst()
                .orElseThrow(() -> new DeviceNotOwnedByUserException(deviceId, userId));

        double totalEnergy = measurementRepository.getTotalEnergyConsumption(
                Collections.singletonList(deviceId), startTime, endTime, deviceId);

        String deviceName = Optional.ofNullable(device.getName()).orElse("Unknown Device");

        DeviceDetails deviceDetails = new DeviceDetails(deviceId, totalEnergy, deviceName);

        return new TotalEnergyDetailedResponse(totalEnergy, List.of(deviceDetails));
    }

    private TotalEnergyDetailedResponse getTotalEnergyForAllDevices(String startTime, String endTime, Set<Device> devices) {

        List<String> deviceIds = devices.stream()
                .map(Device::getDeviceId)
                .collect(Collectors.toList());

        Map<String, Double> devicesDetailsMap = measurementRepository.getTotalEnergyConsumptionPerDevice(
                deviceIds, startTime, endTime);

        double totalEnergy = devicesDetailsMap.values().stream()
                .mapToDouble(Double::doubleValue)
                .sum();

        List<DeviceDetails> devicesDetails = devices.stream()
                .map(device -> {
                    Double energy = devicesDetailsMap.getOrDefault(device.getDeviceId(), 0.0);
                    String name = Optional.ofNullable(device.getName()).orElse("Unknown Device");
                    return new DeviceDetails(device.getDeviceId(), energy, name);
                })
                .collect(Collectors.toList());

        return new TotalEnergyDetailedResponse(totalEnergy, devicesDetails);
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