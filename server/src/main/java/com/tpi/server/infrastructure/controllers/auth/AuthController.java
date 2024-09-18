package com.tpi.server.infrastructure.controllers.auth;

import com.tpi.server.application.usecases.auth.AuthLogin;
import com.tpi.server.application.usecases.auth.AuthRegister;
import com.tpi.server.infrastructure.dtos.AuthResponse;
import com.tpi.server.infrastructure.dtos.LoginRequest;
import com.tpi.server.infrastructure.dtos.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthLogin authLogin;
    private final AuthRegister authRegister;


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
}
