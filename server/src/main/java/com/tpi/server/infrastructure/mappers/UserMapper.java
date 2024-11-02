package com.tpi.server.infrastructure.mappers;

import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.dtos.UserDTO;
import com.tpi.server.infrastructure.dtos.UserResponseDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public UserMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public UserDTO toDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }

    public User toEntity(UserDTO userDTO) {
        return modelMapper.map(userDTO, User.class);
    }

    public UserResponseDTO toResponseDTO(User user) {
        return modelMapper.map(user, UserResponseDTO.class);
    }

    public User toEntity(UserResponseDTO userResponseDTO) {
        return modelMapper.map(userResponseDTO, User.class);
    }
}
