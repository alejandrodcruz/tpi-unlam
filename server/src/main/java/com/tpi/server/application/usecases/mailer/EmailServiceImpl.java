package com.tpi.server.application.usecases.mailer;

import com.tpi.server.infrastructure.dtos.EmailRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailServiceImpl implements IEmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final JavaMailSender javaMailSender;

    public EmailServiceImpl(JavaMailSender mailSender, TemplateEngine templateEngine, JavaMailSender javaMailSender) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.javaMailSender = javaMailSender;
    }

    @Override
    public void sendEmail(EmailRequest emailDTO) throws MessagingException {
        try {
            MimeMessage mimeMessage =
                    mailSender.createMimeMessage();

            MimeMessageHelper mimeMessageHelper =
                    new MimeMessageHelper(mimeMessage, true, "UTF-8");

            mimeMessageHelper.setTo("nicolas.larsen96@gmail.com");
            mimeMessageHelper.setSubject(emailDTO.getSubject());

            Context context = new Context();
            context.setVariable("message", emailDTO.getBody());
            String contentHtml = templateEngine.process("email", context);

            mimeMessageHelper.setText(contentHtml, true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar mail", e);
        }

    }
}
