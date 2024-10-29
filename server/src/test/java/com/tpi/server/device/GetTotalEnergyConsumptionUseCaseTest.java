package com.tpi.server.device;

import com.tpi.server.application.usecases.influx.GetTotalEnergyConsumptionUseCase;
import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.DeviceDetails;
import com.tpi.server.domain.models.TotalEnergyDetailedResponse;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import com.tpi.server.infrastructure.repositories.MeasurementRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.format.DateTimeParseException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

public class GetTotalEnergyConsumptionUseCaseTest {

    @Mock
    private MeasurementRepository measurementRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private DeviceRepository deviceRepository;

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
        String deviceId = null; // No se filtra por dispositivo

        // Crear usuario con dispositivos
        User user = new User();
        user.setId(userId);

        Device device1 = new Device();
        device1.setDeviceId("device1");
        device1.setName("Device 1");
        Device device2 = new Device();
        device2.setDeviceId("device2");
        device2.setName("Device 2");

        Set<Device> devices = new HashSet<>(Arrays.asList(device1, device2));
        user.setDevices(devices);

        // Simular consumo por dispositivo
        Map<String, Double> devicesDetails = new HashMap<>();
        devicesDetails.put("device1", 50.0);
        devicesDetails.put("device2", 50.0);

        double expectedTotalEnergy = 100.0;

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(measurementRepository.getTotalEnergyConsumptionPerDevice(anyList(), eq(startTime), eq(endTime)))
                .thenReturn(devicesDetails);

        when(deviceRepository.findById("device1")).thenReturn(Optional.of(device1));
        when(deviceRepository.findById("device2")).thenReturn(Optional.of(device2));

        TotalEnergyDetailedResponse response = getTotalEnergyConsumptionUseCase.execute(userId, startTime, endTime, deviceId);

        List<DeviceDetails> expectedDevicesDetails = Arrays.asList(
                new DeviceDetails("device1", 50.0, "Device 1"),
                new DeviceDetails("device2", 50.0, "Device 2")
        );

        assertEquals(expectedTotalEnergy, response.getTotalEnergy());
        assertEquals(expectedDevicesDetails, response.getDevicesDetails()); // Actualiza esto
        assertNull(response.getDeviceId());

        verify(userRepository, times(1)).findById(userId);
        verify(measurementRepository, times(1)).getTotalEnergyConsumptionPerDevice(anyList(), eq(startTime), eq(endTime));
        verify(deviceRepository, times(1)).findById("device1");
        verify(deviceRepository, times(1)).findById("device2");
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
        device1.setDeviceId(deviceId);
        device1.setName("Device 1");

        Device device2 = new Device();
        device2.setDeviceId("device2");
        device2.setName("Device 2");

        Set<Device> devices = new HashSet<>(Arrays.asList(device1, device2));
        user.setDevices(devices);

        double expectedTotalEnergy = 50.0;

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(measurementRepository.getTotalEnergyConsumption(
                eq(Collections.singletonList(deviceId)), eq(startTime), eq(endTime), eq(deviceId)))
                .thenReturn(expectedTotalEnergy);

        when(deviceRepository.findById(deviceId)).thenReturn(Optional.of(device1));

        TotalEnergyDetailedResponse response = getTotalEnergyConsumptionUseCase.execute(userId, startTime, endTime, deviceId);

        List<DeviceDetails> expectedDevicesDetails = Collections.singletonList(
                new DeviceDetails(deviceId, expectedTotalEnergy, "Device 1")
        );
        assertEquals(expectedDevicesDetails, response.getDevicesDetails());

        verify(userRepository, times(1)).findById(userId);
        verify(measurementRepository, times(1)).getTotalEnergyConsumption(
                eq(Collections.singletonList(deviceId)), eq(startTime), eq(endTime), eq(deviceId));
        verify(deviceRepository, times(1)).findById(deviceId);
    }

    @Test
    public void testGetTotalEnergyConsumptionUserNotFound() {
        Integer userId = 1;
        String startTime = "2024-10-01T00:00:00Z";
        String endTime = "2024-10-31T23:59:59Z";
        String deviceId = null;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        TotalEnergyDetailedResponse response = getTotalEnergyConsumptionUseCase.execute(userId, startTime, endTime, deviceId);

        assertEquals(0.0, response.getTotalEnergy());
        assertNull(response.getDevicesDetails());
        assertNull(response.getDeviceId());

        verify(userRepository, times(1)).findById(userId);
        verifyNoMoreInteractions(measurementRepository);
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

        TotalEnergyDetailedResponse response = getTotalEnergyConsumptionUseCase.execute(userId, startTime, endTime, deviceId);

        assertEquals(0.0, response.getTotalEnergy());
        assertNull(response.getDevicesDetails());
        assertNull(response.getDeviceId());

        verify(userRepository, times(1)).findById(userId);
        verifyNoMoreInteractions(measurementRepository);
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

        TotalEnergyDetailedResponse response = getTotalEnergyConsumptionUseCase.execute(userId, startTime, endTime, deviceId);

        assertEquals(0.0, response.getTotalEnergy());
        assertNull(response.getDevicesDetails());
        assertNull(response.getDeviceId());

        verify(userRepository, times(1)).findById(userId);
        verifyNoMoreInteractions(measurementRepository);
    }
}

