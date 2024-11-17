package com.tpi.server.device;

import com.tpi.server.domain.models.Address;
import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.User;
import com.tpi.server.application.usecases.device.DevicePairingUseCase;
import com.tpi.server.infrastructure.exceptions.AddressNotFoundException;
import com.tpi.server.infrastructure.exceptions.AddressNotOwnedByUserException;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
import com.tpi.server.infrastructure.repositories.AddressRepository;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.ArgumentCaptor;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DevicePairingUseCaseTest {

    @Mock
    private DeviceRepository deviceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private DevicePairingUseCase devicePairingUseCase;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void pairDeviceSuccess() {
        String pairingCode = "123456";
        Integer userId = 1;
        String name = "Radio";
        Long addressId = 100L; // Nuevo addressId

        Device device = new Device();
        device.setDeviceId("JJ:BB:CC:DD:EE:CC");
        device.setPairingCode(pairingCode);
        device.setAssigned(false);

        User user = new User();
        user.setId(userId);
        user.setUsername("testUser");

        Address address = new Address();
        address.setId(addressId);
        address.setUser(user); // La dirección pertenece al usuario

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(device);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(addressRepository.findById(addressId)).thenReturn(Optional.of(address)); // Simular retorno de la dirección
        when(deviceRepository.save(any(Device.class))).thenReturn(device);

        boolean result = devicePairingUseCase.pairDevice(pairingCode, userId, name, addressId);

        assertTrue(result);
        assertEquals(user, device.getUser());
        assertEquals(address, device.getAddress()); // Verificar que la dirección se asigna
        assertTrue(device.isAssigned());
        assertNull(device.getPairingCode());
        assertEquals(name, device.getName());

        ArgumentCaptor<Device> deviceCaptor = ArgumentCaptor.forClass(Device.class);
        verify(deviceRepository, times(1)).save(deviceCaptor.capture());

        Device savedDevice = deviceCaptor.getValue();
        assertEquals(name, savedDevice.getName());
        assertEquals(address, savedDevice.getAddress()); // Verificar en el dispositivo guardado
    }

    @Test
    public void pairDeviceDeviceAlreadyAssigned() {
        String pairingCode = "123456";
        Integer userId = 1;
        String name = "Dispositivo Ya Asignado";
        Long addressId = 100L;

        Device device = new Device();
        device.setPairingCode(pairingCode);
        device.setAssigned(true);

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(device);

        boolean result = devicePairingUseCase.pairDevice(pairingCode, userId, name, addressId);

        assertFalse(result);

        verify(deviceRepository, never()).save(any(Device.class));
    }

    @Test
    public void pairDeviceInvalidPairingCode() {
        String pairingCode = "invalid-code";
        Integer userId = 1;
        String name = "Dispositivo Inválido";
        Long addressId = 100L;

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(null);

        boolean result = devicePairingUseCase.pairDevice(pairingCode, userId, name, addressId);

        assertFalse(result);
        verify(deviceRepository, never()).save(any(Device.class));
    }

    @Test
    public void pairDeviceUserNotFound() {
        String pairingCode = "123456";
        Integer userId = 1;
        String name = "Usuario No Encontrado";
        Long addressId = 100L;

        Device device = new Device();
        device.setPairingCode(pairingCode);
        device.setAssigned(false);

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(device);
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(UserNotFoundException.class, () -> {
            devicePairingUseCase.pairDevice(pairingCode, userId, name, addressId);
        });

        assertEquals("Usuario con ID " + userId + " no existe.", exception.getMessage());
        verify(deviceRepository, never()).save(any(Device.class));
    }

    @Test
    public void pairDeviceAddressNotFound() {
        String pairingCode = "123456";
        Integer userId = 1;
        String name = "Dirección No Encontrada";
        Long addressId = 100L;

        Device device = new Device();
        device.setPairingCode(pairingCode);
        device.setAssigned(false);

        User user = new User();
        user.setId(userId);
        user.setUsername("testUser");

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(device);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(addressRepository.findById(addressId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(AddressNotFoundException.class, () -> {
            devicePairingUseCase.pairDevice(pairingCode, userId, name, addressId);
        });

        assertEquals("Dirección con ID " + addressId + " no encontrada", exception.getMessage());
        verify(deviceRepository, never()).save(any(Device.class));
    }

    @Test
    public void pairDeviceAddressDoesNotBelongToUser() {
        String pairingCode = "123456";
        Integer userId = 1;
        String name = "Dirección No Pertenece al Usuario";
        Long addressId = 100L;

        Device device = new Device();
        device.setPairingCode(pairingCode);
        device.setAssigned(false);

        User user = new User();
        user.setId(userId);
        user.setUsername("testUser");

        User otherUser = new User();
        otherUser.setId(2);
        otherUser.setUsername("otherUser");

        Address address = new Address();
        address.setId(addressId);
        address.setUser(otherUser); // La dirección pertenece a otro usuario

        when(deviceRepository.findByPairingCode(pairingCode)).thenReturn(device);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(addressRepository.findById(addressId)).thenReturn(Optional.of(address));

        RuntimeException exception = assertThrows(AddressNotOwnedByUserException.class, () -> {
            devicePairingUseCase.pairDevice(pairingCode, userId, name, addressId);
        });

        assertEquals("La dirección con ID " + addressId + " no pertenece al usuario con ID " + userId, exception.getMessage());
        verify(deviceRepository, never()).save(any(Device.class));
    }
}
