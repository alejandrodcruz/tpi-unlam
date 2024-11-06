package com.tpi.server.application.usecases.influx;

import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.Measurement;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.MeasurementRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class GetUserMeasurementsUseCase {

    private final MeasurementRepository measurementRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public GetUserMeasurementsUseCase(MeasurementRepository measurementRepository, UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.measurementRepository = measurementRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    private Integer userId;
    private List<String> fields;
    private String timeRange;
    private String deviceId;

    public void startWS(Integer userId, List<String> fields, String timeRange, String deviceId) {
        this.userId = userId;
        this.fields = fields;
        this.timeRange = timeRange;
        this.deviceId = deviceId;
    }

    @Scheduled(fixedRate = 5000)
    public void startMeasurentsWS() {
        if (userId == null || fields == null || timeRange == null) {
            return;
        }
        List<Measurement> data = execute(userId, fields, timeRange, deviceId);
        messagingTemplate.convertAndSend("/topic/measurements", data);
    }

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
