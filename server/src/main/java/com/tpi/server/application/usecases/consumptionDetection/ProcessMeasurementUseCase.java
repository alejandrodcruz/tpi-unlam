package com.tpi.server.application.usecases.consumptionDetection;

import com.tpi.server.domain.models.KnownDevice;
import com.tpi.server.domain.models.Measurement;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProcessMeasurementUseCase {

    private final FindKnownDeviceByPowerRangeUseCase findKnownDeviceByPowerRangeUseCase;
    private final SimpMessagingTemplate messagingTemplate;
    private final double POWER_THRESHOLD = 200.0;
    private final double TOLERANCE = 100.0;

    // State per device
    private Map<String, DeviceState> deviceStates = new HashMap<>();

    public void execute(Measurement measurement) {
        String deviceId = measurement.getDeviceId();
        DeviceState state = deviceStates.computeIfAbsent(deviceId, k -> new DeviceState());

        double currentPower = measurement.getPower();
        double deltaPower = currentPower - state.lastPowerValue;

        if (deltaPower > POWER_THRESHOLD) {
            if (!state.increaseDetected) {
                state.increaseDetected = true;
                state.increaseStartTime = Instant.now();
                state.lastPowerValue = currentPower;
            } else {
                Duration duration = Duration.between(state.increaseStartTime, Instant.now());
                if (duration.getSeconds() >= 10) {
                    // Sustained increase confirmed
                    Integer userId = getUserIdByDeviceId(deviceId); // Implement this method
                    notifyUserForDeviceInfo(deltaPower, userId);
                    checkForKnownDevice(deltaPower, userId);
                    state.increaseDetected = false;
                }
            }
        } else {
            state.increaseDetected = false;
        }

        state.lastPowerValue = currentPower;
    }

    private void notifyUserForDeviceInfo(double deltaPower, Integer userId) {
        messagingTemplate.convertAndSend("/topic/device-detection/" + userId, deltaPower);
    }

    private void checkForKnownDevice(double deltaPower, Integer userId) {
        List<KnownDevice> matchingDevices = findKnownDeviceByPowerRangeUseCase.execute(deltaPower, TOLERANCE, userId);

        if (!matchingDevices.isEmpty()) {
            reportDeviceActivated(matchingDevices.get(0), userId);
        }
    }

    private void reportDeviceActivated(KnownDevice device, Integer userId) {
        messagingTemplate.convertAndSend("/topic/device-activated/" + userId, device.getName());
    }

    private Integer getUserIdByDeviceId(String deviceId) {
        // Implement logic to retrieve userId from deviceId
        // For example, query the DeviceRepository
        return null; // Replace with actual userId
    }

    private static class DeviceState {
        double lastPowerValue = 0.0;
        Instant increaseStartTime;
        boolean increaseDetected = false;
    }
}
