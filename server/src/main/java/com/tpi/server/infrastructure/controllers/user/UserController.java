package com.tpi.server.infrastructure.controllers.user;

import com.tpi.server.application.usecases.user.GetUserDataUseCase;
import com.tpi.server.application.usecases.user.UpdateUserDataUseCase;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.dtos.UserDTO;
import com.tpi.server.infrastructure.mappers.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final GetUserDataUseCase getUserDataUseCase;
    private final UpdateUserDataUseCase updateUserDataUseCase;
    private final UserMapper userMapper;

    @GetMapping("/{userId}")
    public UserDTO getUserData(@PathVariable Integer userId) {
        User user = getUserDataUseCase.execute(userId);
        return userMapper.toDTO(user);
    }

    @PutMapping("/{userId}")
    public UserDTO updateUserData(@PathVariable Integer userId, @RequestBody UserDTO updatedUserData) {
        User user = userMapper.toEntity(updatedUserData);
        User updatedUser = updateUserDataUseCase.execute(userId, user);
        return userMapper.toDTO(updatedUser);
    }
}