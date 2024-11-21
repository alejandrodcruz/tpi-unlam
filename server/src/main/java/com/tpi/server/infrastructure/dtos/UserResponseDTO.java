package com.tpi.server.infrastructure.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserResponseDTO {
    private Integer id;
    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String username;
    @Email(message = "El email debe ser válido")
    private String email;
    private boolean hasCompletedOnboarding;
}