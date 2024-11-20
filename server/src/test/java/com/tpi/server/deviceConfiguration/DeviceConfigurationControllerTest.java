package com.tpi.server.deviceConfiguration;

import com.tpi.server.application.usecases.deviceConfiguration.AddConfigurationUseCase;
import com.tpi.server.application.usecases.deviceConfiguration.GetDeviceConfigurationsUseCase;
import com.tpi.server.application.usecases.mqtt.MeasurementUseCase;
import com.tpi.server.domain.models.DeviceConfiguration;
import com.tpi.server.infrastructure.controllers.device.DeviceConfigurationController;
import com.tpi.server.infrastructure.dtos.DeviceConfigurationRequest;
import com.tpi.server.infrastructure.dtos.UpdateDeviceConfigurationRequest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class DeviceConfigurationControllerTest {

    @Mock
    private GetDeviceConfigurationsUseCase getDeviceConfigurationsUseCase;

    @Mock
    private AddConfigurationUseCase addConfigurationUseCase;

    @Mock
    private MeasurementUseCase measurementUseCase;

    @InjectMocks
    private DeviceConfigurationController controller;

    private final MockMvc mockMvc;

    DeviceConfigurationControllerTest() {
        MockitoAnnotations.openMocks(this);
        this.mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void testGetDeviceConfiguration() throws Exception {
        DeviceConfigurationRequest request = new DeviceConfigurationRequest();
        request.setDeviceId("device-123");

        DeviceConfiguration config = new DeviceConfiguration();
        config.setDeviceId("device-123");

        when(getDeviceConfigurationsUseCase.execute("device-123")).thenReturn(config);

        mockMvc.perform(post("/configurations/device")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"deviceId\":\"device-123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deviceId").value("device-123"));

        verify(getDeviceConfigurationsUseCase, times(1)).execute("device-123");
    }

    @Test
    void testAddConfiguration() throws Exception {
        UpdateDeviceConfigurationRequest request = new UpdateDeviceConfigurationRequest();
        request.setDeviceId("device-123");
        request.setHighConsumptionActive(true);
        request.setHighConsumptionValue(100.0);

        DeviceConfiguration config = new DeviceConfiguration();
        config.setDeviceId("device-123");

        when(addConfigurationUseCase.execute(any(DeviceConfiguration.class))).thenReturn(config);
        
        mockMvc.perform(post("/configurations/update-device")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                          "deviceId": "device-123",
                          "highConsumptionActive": true,
                          "highConsumptionValue": 100.0
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deviceId").value("device-123"));

        verify(addConfigurationUseCase, times(1)).execute(any(DeviceConfiguration.class));
        verify(measurementUseCase, times(1)).updateAlertConditions(config);
    }
}
