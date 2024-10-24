package com.tpi.server.infrastructure.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {
    private Integer id;
    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String username;
    @Email(message = "El email debe ser válido")
    private String email;
    private boolean hasCompletedOnboarding;
    private Set<AddressDTO> addresses;
}
