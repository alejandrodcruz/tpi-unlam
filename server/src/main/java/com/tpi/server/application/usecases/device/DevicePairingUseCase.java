package com.tpi.server.application.usecases.device;

import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DevicePairingUseCase {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    public boolean pairDevice(String pairingCode, Integer userId, String name) {
        Device device = deviceRepository.findByPairingCode(pairingCode);
        if (device != null && !device.isAssigned()) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            device.setUser(user);
            device.setAssigned(true);
            device.setPairingCode(null);
            device.setName(name);
            deviceRepository.save(device);
            return true;
        } else {
            return false;
        }
    }
}
