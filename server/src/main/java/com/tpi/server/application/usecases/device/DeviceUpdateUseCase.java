package com.tpi.server.application.usecases.device;

import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.exceptions.DeviceNotFoundException;
import com.tpi.server.infrastructure.exceptions.DeviceNotOwnerException;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeviceUpdateUseCase {

    private final DeviceRepository deviceRepository;

    @Transactional
    public Device updateDevice(String deviceId, String newName) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication.getPrincipal() instanceof User)) {
            throw new RuntimeException("Usuario no autenticado correctamente.");
        }

        User authenticatedUser = (User) authentication.getPrincipal();
        Integer authenticatedUserId = authenticatedUser.getId();

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new DeviceNotFoundException(deviceId));

        // Verificar la propiedad del dispositivo
        if (!device.getUser().getId().equals(authenticatedUserId)) {
            throw new DeviceNotOwnerException(deviceId, authenticatedUserId);
        }

        device.setName(newName);
        return deviceRepository.save(device);
    }
}
