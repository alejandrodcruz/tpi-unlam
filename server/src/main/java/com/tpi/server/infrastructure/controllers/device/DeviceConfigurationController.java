package com.tpi.server.infrastructure.controllers.device;

import com.tpi.server.application.usecases.deviceConfiguration.AddConfigurationUseCase;
import com.tpi.server.application.usecases.deviceConfiguration.GetUserConfigurationsUseCase;
import com.tpi.server.domain.models.DeviceConfiguration;
import com.tpi.server.infrastructure.dtos.DeviceConfigurationRequest;
import com.tpi.server.infrastructure.dtos.UpdateDeviceConfigurationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/configurations")
@RequiredArgsConstructor
public class DeviceConfigurationController {

    private final GetUserConfigurationsUseCase getUserConfigurationsUseCase;
    private final AddConfigurationUseCase addConfigurationUseCase;

    @PostMapping("/device")
    public DeviceConfiguration getDeviceConfiguration(@RequestBody DeviceConfigurationRequest deviceConfigurationRequest) {
        return getUserConfigurationsUseCase.execute(deviceConfigurationRequest.getDeviceId());
    }

    @PostMapping("/update-device")
    public DeviceConfiguration addConfiguration(@RequestBody UpdateDeviceConfigurationRequest deviceConfigurationRequest) {
        return addConfigurationUseCase.execute(DeviceConfiguration.builder()
                        .highConsumptionActive(deviceConfigurationRequest.isHighConsumptionActive())
                        .highConsumptionValue(deviceConfigurationRequest.getHighConsumptionValue())
                        .energyLossActive(deviceConfigurationRequest.isEnergyLossActive())
                        .highHumidityValue(deviceConfigurationRequest.getHighHumidityValue())
                        .highHumidityActive(deviceConfigurationRequest.isHighHumidityActive())
                        .lostDeviceActive(deviceConfigurationRequest.isLostDeviceActive())
                        .highTemperatureValue(deviceConfigurationRequest.getHighTemperatureValue())
                        .highTensionActive(deviceConfigurationRequest.isHighTensionActive())
                        .highTensionValue(deviceConfigurationRequest.getHighTensionValue())
                        .highTemperatureActive(deviceConfigurationRequest.isHighTemperatureActive())
                        .lowTensionValue(deviceConfigurationRequest.getLowTensionValue())
                        .lowTensionActive(deviceConfigurationRequest.isLowTensionActive())
                        .peakPowerCurrentValue(deviceConfigurationRequest.getPeakPowerCurrentValue())
                        .peakPowerCurrentActive(deviceConfigurationRequest.isPeakPowerCurrentActive())
                        .deviceId(deviceConfigurationRequest.getDeviceId())
                    .build());
    }
}
