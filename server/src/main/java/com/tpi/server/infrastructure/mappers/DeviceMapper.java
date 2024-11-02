package com.tpi.server.infrastructure.mappers;

import com.tpi.server.domain.models.Device;
import com.tpi.server.infrastructure.dtos.DeviceResponseDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DeviceMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public DeviceMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public DeviceResponseDTO toDTO(Device device) {
        return modelMapper.map(device, DeviceResponseDTO.class);
    }

    public Device toEntity(DeviceResponseDTO deviceDTO) {
        return modelMapper.map(deviceDTO, Device.class);
    }
}