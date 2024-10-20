package com.tpi.server.device;

import com.tpi.server.application.usecases.influx.GetTotalEnergyConsumptionUseCase;
import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.MeasurementRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class GetTotalEnergyConsumptionUseCaseTest {

    @Mock
    private MeasurementRepository measurementRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GetTotalEnergyConsumptionUseCase getTotalEnergyConsumptionUseCase;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetTotalEnergyConsumptionAllDevices() {
        Integer userId = 1;
        String startTime = "2024-10-01T00:00:00Z";
        String endTime = "2024-10-31T23:59:59Z";
        String deviceId = null; // No filtro por dispositivo

        User user = new User();
        user.setId(userId);

        Device device1 = new Device();
        device1.setDeviceId("device1");
        Device device2 = new Device();
        device2.setDeviceId("device2");

        Set<Device> devices = new HashSet<>(Arrays.asList(device1, device2));
        user.setDevices(devices);

        // Valor de consumo total simulado
        double expectedTotalEnergy = 100.0;

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(measurementRepository.getTotalEnergyConsumption(anyList(), eq(startTime), eq(endTime), eq(deviceId)))
                .thenReturn(expectedTotalEnergy);

        double totalEnergy = getTotalEnergyConsumptionUseCase.execute(userId, startTime, endTime, deviceId);

        assertEquals(expectedTotalEnergy, totalEnergy);

        verify(userRepository, times(1)).findById(userId);
        verify(measurementRepository, times(1)).getTotalEnergyConsumption(anyList(), eq(startTime), eq(endTime), eq(deviceId));
    }

    @Test
    public void testGetTotalEnergyConsumptionByDeviceId() {
        Integer userId = 1;
        String startTime = "2024-10-01T00:00:00Z";
        String endTime = "2024-10-31T23:59:59Z";
        String deviceId = "device1";

        User user = new User();
        user.setId(userId);

        Device device1 = new Device();
        device1.setDeviceId("device1");
        Device device2 = new Device();
        device2.setDeviceId("device2");

        Set<Device> devices = new HashSet<>(Arrays.asList(device1, device2));
        user.setDevices(devices);

        double expectedTotalEnergy = 50.0;

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(measurementRepository.getTotalEnergyConsumption(anyList(), eq(startTime), eq(endTime), eq(deviceId)))
                .thenReturn(expectedTotalEnergy);

        double totalEnergy = getTotalEnergyConsumptionUseCase.execute(userId, startTime, endTime, deviceId);

        assertEquals(expectedTotalEnergy, totalEnergy);

        verify(userRepository, times(1)).findById(userId);
        verify(measurementRepository, times(1)).getTotalEnergyConsumption(anyList(), eq(startTime), eq(endTime), eq(deviceId));
    }

    @Test
    public void testGetTotalEnergyConsumptionUserNotFound() {
        Integer userId = 1;
        String startTime = "2024-10-01T00:00:00Z";
        String endTime = "2024-10-31T23:59:59Z";
        String deviceId = null;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        double totalEnergy = getTotalEnergyConsumptionUseCase.execute(userId, startTime, endTime, deviceId);

        assertEquals(0.0, totalEnergy);

        verify(userRepository, times(1)).findById(userId);
        verify(measurementRepository, never()).getTotalEnergyConsumption(anyList(), anyString(), anyString(), anyString());
    }

    @Test
    public void testGetTotalEnergyConsumptionNoDevices() {
        Integer userId = 1;
        String startTime = "2024-10-01T00:00:00Z";
        String endTime = "2024-10-31T23:59:59Z";
        String deviceId = null;

        User user = new User();
        user.setId(userId);
        user.setDevices(new HashSet<>());

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        double totalEnergy = getTotalEnergyConsumptionUseCase.execute(userId, startTime, endTime, deviceId);

        assertEquals(0.0, totalEnergy);

        verify(userRepository, times(1)).findById(userId);
        verify(measurementRepository, never()).getTotalEnergyConsumption(anyList(), anyString(), anyString(), anyString());
    }

    @Test
    public void testGetTotalEnergyConsumptionDeviceNotOwnedByUser() {
        Integer userId = 1;
        String startTime = "2024-10-01T00:00:00Z";
        String endTime = "2024-10-31T23:59:59Z";
        String deviceId = "device3";

        // Crear usuario con dispositivos
        User user = new User();
        user.setId(userId);

        Device device1 = new Device();
        device1.setDeviceId("device1");
        Device device2 = new Device();
        device2.setDeviceId("device2");

        Set<Device> devices = new HashSet<>(Arrays.asList(device1, device2));
        user.setDevices(devices);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        double totalEnergy = getTotalEnergyConsumptionUseCase.execute(userId, startTime, endTime, deviceId);

        assertEquals(0.0, totalEnergy);

        verify(userRepository, times(1)).findById(userId);
        verify(measurementRepository, never()).getTotalEnergyConsumption(anyList(), anyString(), anyString(), anyString());
    }

}
