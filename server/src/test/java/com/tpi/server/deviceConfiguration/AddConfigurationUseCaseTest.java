package com.tpi.server.deviceConfiguration;

import com.tpi.server.application.services.deviceConfiguration.ConfigurationServiceImpl;
import com.tpi.server.application.usecases.deviceConfiguration.AddConfigurationUseCase;
import com.tpi.server.application.usecases.deviceConfiguration.DeleteDeviceConfigurationsUseCase;
import com.tpi.server.application.usecases.deviceConfiguration.SaveDeviceConfigurationsUseCase;
import com.tpi.server.domain.models.DeviceConfiguration;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class AddConfigurationUseCaseTest {

    @Mock
    private ConfigurationServiceImpl configurationService;

    @Mock
    private SaveDeviceConfigurationsUseCase saveDeviceConfiguration;

    @Mock
    private DeleteDeviceConfigurationsUseCase deleteDeviceConfiguration;

    @InjectMocks
    private AddConfigurationUseCase addConfigurationUseCase;

    AddConfigurationUseCaseTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testExecuteWithExistingConfig() {
        DeviceConfiguration existingConfig = new DeviceConfiguration();
        existingConfig.setDeviceId("device-123");

        DeviceConfiguration newConfig = new DeviceConfiguration();
        newConfig.setDeviceId("device-123");

        when(configurationService.getDeviceConfiguration("device-123")).thenReturn(existingConfig);
        when(saveDeviceConfiguration.execute(newConfig)).thenReturn(newConfig);

        DeviceConfiguration result = addConfigurationUseCase.execute(newConfig);

        assertNotNull(result);
        verify(deleteDeviceConfiguration, times(1)).execute(existingConfig);
        verify(saveDeviceConfiguration, times(1)).execute(newConfig);
    }

    @Test
    void testExecuteWithoutExistingConfig() {
        DeviceConfiguration newConfig = new DeviceConfiguration();
        newConfig.setDeviceId("device-123");

        when(configurationService.getDeviceConfiguration("device-123")).thenReturn(null);
        when(saveDeviceConfiguration.execute(newConfig)).thenReturn(newConfig);

        DeviceConfiguration result = addConfigurationUseCase.execute(newConfig);

        assertNotNull(result);
        verify(deleteDeviceConfiguration, never()).execute(any());
        verify(saveDeviceConfiguration, times(1)).execute(newConfig);
    }
}
