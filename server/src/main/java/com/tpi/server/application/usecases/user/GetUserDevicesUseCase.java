package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.Device;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GetUserDevicesUseCase {

    private final DeviceRepository deviceRepository;

    public List<Device> execute(Integer userId) {
        return deviceRepository.findByUserId(userId);
    }
}
