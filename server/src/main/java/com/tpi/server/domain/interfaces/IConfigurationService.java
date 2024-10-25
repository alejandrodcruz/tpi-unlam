package com.tpi.server.domain.interfaces;

import com.tpi.server.domain.enums.AlertType;
import com.tpi.server.domain.models.DeviceConfiguration;

public interface IConfigurationService {
    DeviceConfiguration getDeviceConfiguration(String deviceId);
    boolean isAlertActive(String deviceId, AlertType alertType);
}
