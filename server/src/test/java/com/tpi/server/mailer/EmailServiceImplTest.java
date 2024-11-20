package com.tpi.server.mailer;

import com.tpi.server.application.usecases.mailer.EmailServiceImpl;
import com.tpi.server.infrastructure.dtos.EmailRequest;
import com.tpi.server.infrastructure.exceptions.SendEmailException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EmailServiceImplTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private TemplateEngine templateEngine;

    @InjectMocks
    private EmailServiceImpl emailService;

    private EmailRequest emailRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        emailRequest = EmailRequest.builder()
                .subject("Test Subject")
                .body("Test Body")
                .build();
    }

    @Test
    void sendEmail_Success() throws SendEmailException {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        when(templateEngine.process(eq("code-email"), any(Context.class)))
                .thenReturn("<html><body>Test Email Content</body></html>");

        emailService.sendEmail(emailRequest);

        verify(mailSender, times(1)).createMimeMessage();
        verify(mailSender, times(1)).send(mimeMessage);

        ArgumentCaptor<Context> contextCaptor = ArgumentCaptor.forClass(Context.class);
        verify(templateEngine, times(1)).process(eq("code-email"), contextCaptor.capture());

        Context capturedContext = contextCaptor.getValue();
        assertEquals("Test Body", capturedContext.getVariable("message"));
    }

    @Test
    void sendAlertEmail_Success() throws SendEmailException {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        when(templateEngine.process(eq("alert-email"), any(Context.class)))
                .thenReturn("<html><body>Alert Email Content</body></html>");

        emailService.sendAlertEmail(emailRequest);

        verify(mailSender, times(1)).createMimeMessage();
        verify(mailSender, times(1)).send(mimeMessage);

        ArgumentCaptor<Context> contextCaptor = ArgumentCaptor.forClass(Context.class);
        verify(templateEngine, times(1)).process(eq("alert-email"), contextCaptor.capture());

        Context capturedContext = contextCaptor.getValue();
        assertEquals("Test Body", capturedContext.getVariable("message"));
    }

    @Test
    void sendEmail_ExceptionThrown() {
        when(mailSender.createMimeMessage()).thenThrow(new SendEmailException());

        RuntimeException exception = assertThrows(SendEmailException.class, () -> emailService.sendEmail(emailRequest));
        assertEquals("Error al enviar email", exception.getMessage());
    }
}
