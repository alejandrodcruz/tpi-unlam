package com.tpi.server.application.usecases.influx;

import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.Measurement;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.MeasurementRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class GetUserMeasurementsUseCase {

    private final MeasurementRepository measurementRepository;
    private final UserRepository userRepository;

    public GetUserMeasurementsUseCase(MeasurementRepository measurementRepository, UserRepository userRepository) {
        this.measurementRepository = measurementRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<Measurement> execute(Integer userId, List<String> fields, String timeRange, String deviceId) {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return new ArrayList<>();
        }

        Set<Device> devices = user.getDevices();

        if (devices == null || devices.isEmpty()) {
            return new ArrayList<>();
        }

        List<String> deviceIds = new ArrayList<>();

        if (deviceId != null && !deviceId.isEmpty()) {
            boolean ownsDevice = devices.stream()
                    .anyMatch(device -> device.getDeviceId().equals(deviceId));
            if (!ownsDevice) {
                return new ArrayList<>();
            }
            deviceIds.add(deviceId);
        } else {
            for (Device device : devices) {
                deviceIds.add(device.getDeviceId());
            }
        }

        return measurementRepository.getMeasurements(deviceIds, fields, timeRange);
    }
}
