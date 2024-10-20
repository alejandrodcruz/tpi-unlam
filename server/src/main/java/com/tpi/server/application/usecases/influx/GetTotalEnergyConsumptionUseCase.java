package com.tpi.server.application.usecases.influx;

import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.MeasurementRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class GetTotalEnergyConsumptionUseCase {

    private final MeasurementRepository measurementRepository;
    private final UserRepository userRepository;

    public GetTotalEnergyConsumptionUseCase(MeasurementRepository measurementRepository, UserRepository userRepository) {
        this.measurementRepository = measurementRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public double execute(Integer userId, String startTime, String endTime, String deviceId) {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return 0.0;
        }

        Set<Device> devices = user.getDevices();

        if (devices == null || devices.isEmpty()) {
            return 0.0;
        }

        List<String> deviceIds = new ArrayList<>();
        for (Device device : devices) {
            deviceIds.add(device.getDeviceId());
        }

        // Verificar si el deviceId proporcionado pertenece al usuario
        if (deviceId != null && !deviceId.isEmpty()) {
            if (!deviceIds.contains(deviceId)) {
                // El dispositivo no pertenece al usuario
                return 0.0;
            }
            // Limitar la lista de dispositivos al deviceId proporcionado
            deviceIds = new ArrayList<>();
            deviceIds.add(deviceId);
        }

        return measurementRepository.getTotalEnergyConsumption(deviceIds, startTime, endTime, deviceId);
    }
}
