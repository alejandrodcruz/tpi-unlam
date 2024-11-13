package com.tpi.server.infrastructure.dtos;

import com.tpi.server.domain.enums.AddressType;
import lombok.Data;

@Data
public class AddressDTO {
    private Long id;
    private String street;
    private String city;
    private String country;
    private AddressType type = AddressType.HOME;
}
