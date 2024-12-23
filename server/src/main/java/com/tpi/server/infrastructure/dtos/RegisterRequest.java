package com.tpi.server.infrastructure.dtos;

import com.tpi.server.domain.enums.AddressType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String street;
    private String city;
    private String country;
    private AddressType type;

}
