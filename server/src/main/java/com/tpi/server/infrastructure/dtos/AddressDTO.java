package com.tpi.server.infrastructure.dtos;

import lombok.Data;

@Data
public class AddressDTO {
    private Long id;
    private String street;
    private String city;
    private String country;
}
