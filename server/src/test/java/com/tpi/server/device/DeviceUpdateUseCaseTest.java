package com.tpi.server.device;

import com.tpi.server.application.usecases.device.DeviceUpdateUseCase;
import com.tpi.server.domain.enums.Role;
import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.exceptions.DeviceNotFoundException;
import com.tpi.server.infrastructure.exceptions.DeviceNotOwnerException;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeviceUpdateUseCaseTest {

    @Mock
    private DeviceRepository deviceRepository;

    @InjectMocks
    private DeviceUpdateUseCase deviceUpdateUseCase;

    private final String existingDeviceId = "08:A6:F7:24:71:98";
    private final String newName = "Nuevo Nombre";
    private final Integer authenticatedUserId = 1;
    private final Integer deviceOwnerId = 2;

    @BeforeEach
    void setUp() {
        User authenticatedUser = User.builder()
                .id(authenticatedUserId)
                .username("usuarioAutenticado")
                .password("password")
                .role(Role.USER)
                .hasCompletedOnboarding(true)
                .addresses(Collections.emptySet())
                .devices(Collections.emptySet())
                .build();

        // Configurar el contexto de seguridad con la instancia de User
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(authenticatedUser, null, authenticatedUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        // Limpiar el contexto de seguridad después de cada prueba
        SecurityContextHolder.clearContext();
    }

    @Test
    void updateDeviceSuccess() {
        Device device = Device.builder()
                .deviceId(existingDeviceId)
                .name("Nombre Anterior")
                .user(User.builder()
                        .id(authenticatedUserId)
                        .username("usuarioAutenticado")
                        .password("password")
                        .role(Role.USER)
                        .build())
                .build();

        when(deviceRepository.findById(existingDeviceId)).thenReturn(Optional.of(device));
        when(deviceRepository.save(device)).thenReturn(device);

        Device updatedDevice = deviceUpdateUseCase.updateDevice(existingDeviceId, newName);

        assertEquals(newName, updatedDevice.getName());
        verify(deviceRepository, times(1)).save(device);
    }

    @Test
    void updateDeviceNotOwner() {
        Device device = Device.builder()
                .deviceId(existingDeviceId)
                .name("Nombre Anterior")
                .user(User.builder()
                        .id(deviceOwnerId) // Diferente al usuario autenticado
                        .username("otroUsuario")
                        .password("password")
                        .role(Role.USER)
                        .build())
                .build();

        when(deviceRepository.findById(existingDeviceId)).thenReturn(Optional.of(device));

        DeviceNotOwnerException exception = assertThrows(DeviceNotOwnerException.class, () -> {
            deviceUpdateUseCase.updateDevice(existingDeviceId, newName);
        });

        assertEquals(
                String.format("El usuario con ID '%d' no tiene permiso para modificar el dispositivo con ID '%s'.",
                        authenticatedUserId, existingDeviceId),
                exception.getMessage()
        );
        verify(deviceRepository, never()).save(any(Device.class));
    }

    @Test
    void updateDeviceNotFound() {
        when(deviceRepository.findById(existingDeviceId)).thenReturn(Optional.empty());

        DeviceNotFoundException exception = assertThrows(DeviceNotFoundException.class, () -> {
            deviceUpdateUseCase.updateDevice(existingDeviceId, newName);
        });

        assertEquals(
                String.format("Dispositivo con ID '%s' no encontrado.", existingDeviceId),
                exception.getMessage()
        );
        verify(deviceRepository, never()).save(any(Device.class));
    }
}
