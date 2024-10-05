package com.tpi.server.application.usecases.mailer;

import com.tpi.server.infrastructure.dtos.EmailRequest;
import jakarta.mail.MessagingException;

public interface IEmailService {
    public void sendEmail(EmailRequest emailDTO) throws MessagingException;
}
