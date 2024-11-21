package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.Device;
import com.tpi.server.infrastructure.exceptions.NoDevicesFoundException;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GetUserDevicesUseCase {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    public List<Device> execute(Integer userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        List<Device> devices = deviceRepository.findByUserId(userId);

        if (devices.isEmpty()) {
            throw new NoDevicesFoundException(userId);
        }

        return devices;
    }
}