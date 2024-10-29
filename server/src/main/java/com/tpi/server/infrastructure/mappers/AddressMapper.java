package com.tpi.server.infrastructure.mappers;

import com.tpi.server.domain.models.Address;
import com.tpi.server.infrastructure.dtos.AddressDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public AddressMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public AddressDTO toDTO(Address address) {
        return modelMapper.map(address, AddressDTO.class);
    }

    public Address toEntity(AddressDTO addressDTO) {
        return modelMapper.map(addressDTO, Address.class);
    }
}
