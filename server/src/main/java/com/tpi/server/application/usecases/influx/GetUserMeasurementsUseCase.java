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
    public List<Measurement> execute(Integer userId, List<String> fields, String timeRange) {
        System.out.println("Ejecutando GetUserMeasurementsUseCase con userId: " + userId);

        // Obtener el usuario por userId
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            System.out.println("Usuario no encontrado con userId: " + userId);
            return new ArrayList<>();
        }
        System.out.println("Usuario encontrado: " + user.getUsername());
        System.out.println("User ID: " + user.getId());

        // Obtener los dispositivos asociados al usuario
        Set<Device> devices = user.getDevices();
        System.out.println("Dispositivos es null: " + (devices == null));
        System.out.println("Cantidad de dispositivos asociados: " + devices.size());

        if (devices == null || devices.isEmpty()) {
            System.out.println("No hay dispositivos asociados al usuario con userId: " + userId);
            return new ArrayList<>();
        }

        // Obtener los deviceIds de los dispositivos
        List<String> deviceIds = new ArrayList<>();
        for (Device device : devices) {
            deviceIds.add(device.getDeviceId());
            System.out.println("Dispositivo encontrado: " + device.getDeviceId());
        }

        // Obtener las mediciones para los deviceIds y campos especificados
        return measurementRepository.getMeasurements(deviceIds, fields, timeRange);
    }
}
