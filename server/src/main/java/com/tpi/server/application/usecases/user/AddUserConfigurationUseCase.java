package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.UserConfiguration;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.ConfigurationRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AddUserConfigurationUseCase {

    private final ConfigurationRepository configurationRepository;
    private final UserRepository userRepository;

    public UserConfiguration execute(UserConfiguration configuration, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        configuration.setUser(user);
        return configurationRepository.save(configuration);
    }
}
