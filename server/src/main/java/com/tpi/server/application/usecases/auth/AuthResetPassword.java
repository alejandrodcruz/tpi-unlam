package com.tpi.server.application.usecases.auth;

import com.tpi.server.application.usecases.mailer.EmailServiceImpl;
import com.tpi.server.domain.models.PasswordResetToken;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.dtos.EmailRequest;
import com.tpi.server.infrastructure.repositories.PasswordResetTokenRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthResetPassword {

    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private final EmailServiceImpl emailService;

    public String generateResetCode(String email) throws MessagingException {
        Optional<PasswordResetToken> existingToken = passwordResetTokenRepository.findByEmail(email);

        existingToken.ifPresent(passwordResetTokenRepository::delete);

        String token = UUID.randomUUID().toString().substring(0, 6);

        LocalDateTime expirationDate = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .email(email)
                .resetToken(token)
                .expirationDate(expirationDate)
                .build();

        passwordResetTokenRepository.save(resetToken);

        emailService.sendEmail(EmailRequest.builder()
                .destination(email)
                .subject("Código para restablecer contraseña")
                .body(token)
                .build());

        return token;
    }


    public boolean verifyCode(String email, String resetCode) {
        return passwordResetTokenRepository.findByEmail(email)
                .map(token -> token.getResetToken().equals(resetCode) &&
                        token.getExpirationDate().isAfter(LocalDateTime.now()))
                .orElse(false);
    }

    public void updatePassword(String email, String newPassword) throws MessagingException {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            String encodedPassword = passwordEncoder.encode(newPassword);

            user.setPassword(encodedPassword);

            userRepository.save(user);

            try {
                passwordResetTokenRepository.deleteByEmail(email);
            } catch (Exception e) {
                throw new RuntimeException("Error al eliminar el token de restablecimiento de contraseña", e);
            }


            emailService.sendEmail(EmailRequest.builder()
                            .destination(email)
                            .subject("Contraseña actualizada con exito")
                            .body("Su contraseña ah sido actualizada.")
                            .build());
        } else {
            throw new IllegalArgumentException("No se encontró un usuario con ese correo");
        }
    }
}
