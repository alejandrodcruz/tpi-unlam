package com.tpi.server.application.usecases.influx;

import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.Measurement;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.MeasurementRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.springframework.stereotype.Service;

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

    public List<Measurement> execute(String username, List<String> fields, String timeRange) {
        // Obtener el usuario por username
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            // Manejar usuario no encontrado
            return new ArrayList<>();
        }

        // Obtener los deviceIds de los dispositivos del usuario
        Set<Device> devices = user.getDevices();
        List<String> deviceIds = new ArrayList<>();
        for (Device device : devices) {
            deviceIds.add(device.getDeviceId());
        }

        if (deviceIds.isEmpty()) {
            // No hay dispositivos asociados al usuario
            return new ArrayList<>();
        }

        // Obtener las mediciones para los deviceIds y campos especificados
        return measurementRepository.getMeasurements(deviceIds, fields, timeRange);
    }
}