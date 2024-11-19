package com.tpi.server.application.usecases.influx;

import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.Measurement;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.exceptions.DeviceNotFoundException;
import com.tpi.server.infrastructure.exceptions.DeviceNotOwnerException;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
import com.tpi.server.infrastructure.repositories.MeasurementRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GetUserMeasurementsUseCase {

    private final MeasurementRepository measurementRepository;
    private final UserRepository userRepository;

    public GetUserMeasurementsUseCase(MeasurementRepository measurementRepository, UserRepository userRepository) {
        this.measurementRepository = measurementRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Measurement> execute(Integer userId, List<String> fields, String timeRange, String deviceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        Set<Device> devices = user.getDevices();
        validateUserDevices(devices, userId);

        List<String> deviceIds = determineDeviceIds(devices, deviceId, userId);

        return measurementRepository.getMeasurements(deviceIds, fields, timeRange);
    }

    private void validateUserDevices(Set<Device> devices, Integer userId) {
        if (devices == null || devices.isEmpty()) {
            throw new DeviceNotFoundException("El usuario con ID " + userId + " no posee dispositivos asociados.");
        }
    }

    private List<String> determineDeviceIds(Set<Device> devices, String deviceId, Integer userId) {
        if (deviceId != null && !deviceId.isEmpty()) {
            boolean ownsDevice = devices.stream()
                    .anyMatch(device -> device.getDeviceId().equals(deviceId));
            if (!ownsDevice) {
                throw new DeviceNotOwnerException(deviceId, userId);
            }
            return List.of(deviceId);
        } else {
            return devices.stream()
                    .map(Device::getDeviceId)
                    .collect(Collectors.toList());
        }
    }
}