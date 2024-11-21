package com.tpi.server.alert;

import com.tpi.server.application.usecases.alert.AlertUseCase;
import com.tpi.server.application.usecases.mailer.EmailServiceImpl;
import com.tpi.server.domain.enums.AlertType;
import com.tpi.server.domain.models.Alert;
import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.dtos.AlertDTO;
import com.tpi.server.infrastructure.exceptions.AlertException;
import com.tpi.server.infrastructure.exceptions.GetEmailForAlertException;
import com.tpi.server.infrastructure.repositories.AlertRepository;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Calendar;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class AlertUseCaseTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private AlertRepository alertRepository;

    @Mock
    private DeviceRepository deviceRepository;

    @Mock
    private EmailServiceImpl emailService;

    @InjectMocks
    private AlertUseCase alertUseCase;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void createAlert_Success() throws AlertException, MessagingException {
        AlertDTO alertDTO = AlertDTO.builder()
                .type(AlertType.HighConsumption)
                .deviceId("device123")
                .value(150.5)
                .name("Test Device")
                .build();

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MINUTE, -10);

        when(alertRepository.existsByTypeAndDeviceIdAndDateAfter(alertDTO.getType(), alertDTO.getDeviceId(), calendar.getTime()))
                .thenReturn(false);

        Device device = new Device();
        User user = new User();
        user.setEmail("user@example.com");
        device.setUser(user);

        when(deviceRepository.findDeviceByDeviceId("device123")).thenReturn(device);

        alertUseCase.createAlert(alertDTO);

        verify(alertRepository, times(1)).save(any(Alert.class));
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/alerts"), eq(alertDTO));
        verify(emailService, times(1)).sendAlertEmail(any());
    }

    @Test
    public void createAlert_AllowedAfter10Minutes() throws AlertException, MessagingException {
        AlertDTO alertDTO = AlertDTO.builder()
                .type(AlertType.HighConsumption)
                .deviceId("device123")
                .value(150.5)
                .name("Test Device")
                .message("Exceso de consumo.")
                .build();

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MINUTE, -10);

        // Simula que no hay alertas similares en los últimos 10 minutos
        when(alertRepository.existsByTypeAndDeviceIdAndDateAfter(
                alertDTO.getType(),
                alertDTO.getDeviceId(),
                calendar.getTime()
        )).thenReturn(false);

        // Simula el dispositivo para evitar errores en getEmail
        Device mockDevice = new Device();
        User mockUser = new User();
        mockUser.setEmail("test@example.com");
        mockDevice.setUser(mockUser);

        when(deviceRepository.findDeviceByDeviceId(alertDTO.getDeviceId()))
                .thenReturn(mockDevice);

        // Ejecuta el caso de uso
        alertUseCase.createAlert(alertDTO);

        // Verifica que la alerta fue guardada
        verify(alertRepository, times(1)).save(any(Alert.class));

        // Verifica que se envían mensajes y correos
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/alerts"), any(AlertDTO.class));
        verify(emailService, times(1)).sendAlertEmail(any(com.tpi.server.infrastructure.dtos.EmailRequest.class));
    }



    @Test
    public void createAlert_DeviceNotFound() throws MessagingException {
        AlertDTO alertDTO = AlertDTO.builder()
                .type(AlertType.HighConsumption)
                .deviceId("device123")
                .value(150.5)
                .name("Test Device")
                .build();

        when(deviceRepository.findDeviceByDeviceId("device123")).thenThrow(new RuntimeException());

        assertThrows(GetEmailForAlertException.class, () -> alertUseCase.createAlert(alertDTO));

        verify(alertRepository, never()).save(any(Alert.class));
        verify(messagingTemplate, never()).convertAndSend(anyString(), Optional.ofNullable(any()));
        verify(emailService, never()).sendAlertEmail(any());
    }

    @Test
    public void createAlert_EmailServiceFailure() throws MessagingException {
        AlertDTO alertDTO = AlertDTO.builder()
                .type(AlertType.HighConsumption)
                .deviceId("device123")
                .value(150.5)
                .name("Test Device")
                .build();

        when(alertRepository.existsByTypeAndDeviceIdAndDateAfter(eq(AlertType.HighConsumption), anyString(), any()))
                .thenReturn(false);

        Device device = new Device();
        User user = new User();
        user.setEmail("user@example.com");
        device.setUser(user);

        when(deviceRepository.findDeviceByDeviceId("device123")).thenReturn(device);

        doThrow(new RuntimeException()).when(emailService).sendAlertEmail(any());

        assertThrows(AlertException.class, () -> alertUseCase.createAlert(alertDTO));

        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/alerts"), eq(alertDTO));

        verify(emailService, times(1)).sendAlertEmail(any());
    }

}

