package com.tpi.server.application.usecases.consumptionDetection;

import com.tpi.server.domain.models.KnownDevice;
import com.tpi.server.infrastructure.repositories.KnownDeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindKnownDeviceByPowerRangeUseCase {
    private final KnownDeviceRepository knownDeviceRepository;

    public List<KnownDevice> execute(double deltaPower, double tolerance, Integer userId) {
        double minPower = deltaPower - tolerance;
        double maxPower = deltaPower + tolerance;
        return knownDeviceRepository.findByPowerConsumptionRange(minPower, maxPower, userId);
    }
}