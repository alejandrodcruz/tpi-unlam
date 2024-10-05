package com.tpi.server.infrastructure.controllers.auth;

import com.tpi.server.application.usecases.auth.AuthLogin;
import com.tpi.server.application.usecases.auth.AuthRegister;
import com.tpi.server.application.usecases.auth.AuthResetPassword;
import com.tpi.server.infrastructure.dtos.*;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthLogin authLogin;
    private final AuthRegister authRegister;
    private final AuthResetPassword authResetPassword;

    @PostMapping(value = "login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authLogin.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = "register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authRegister.register(registerRequest));
    }

    @PostMapping(value = "reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody ResetPasswordCodeRequest registerRequest) throws MessagingException {
        return ResponseEntity.ok(new AuthResponse(authResetPassword.generateResetCode(registerRequest.getEmail())));
    }

    @PostMapping(value = "/confirm-reset-password")
    public ResponseEntity<AuthResponse> confirmResetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) throws MessagingException {
        boolean isCodeValid = authResetPassword.verifyCode(resetPasswordRequest.getEmail(), resetPasswordRequest.getResetCode());

        if (!isCodeValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse("Código inválido o expirado"));
        }

        authResetPassword.updatePassword(resetPasswordRequest.getEmail(), resetPasswordRequest.getNewPassword());

        return ResponseEntity.ok(new AuthResponse("Contraseña actualizada con éxito"));
    }

}
