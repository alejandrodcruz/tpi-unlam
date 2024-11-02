package com.tpi.server.application.usecases.consumptionDetection;

import com.tpi.server.domain.models.KnownDevice;
import com.tpi.server.infrastructure.repositories.KnownDeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SaveKnownDeviceUseCase {
    private final KnownDeviceRepository knownDeviceRepository;

    public KnownDevice execute(KnownDevice knownDevice) {
        return knownDeviceRepository.save(knownDevice);
    }
}