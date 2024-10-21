package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class UpdateUserDataUseCase {

    private final UserRepository userRepository;

    @Transactional
    public User execute(Integer userId, User updatedUserData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setEmail(updatedUserData.getEmail());
        user.setUsername(updatedUserData.getUsername());
        user.setHasCompletedOnboarding(updatedUserData.isHasCompletedOnboarding());
        return userRepository.save(user);
    }
}
