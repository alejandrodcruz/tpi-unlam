package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.Configuration;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.ConfigurationRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AddConfigurationUseCase {

    private final ConfigurationRepository configurationRepository;
    private final UserRepository userRepository;

    public Configuration execute(Configuration configuration, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        configuration.setUser(user);
        return configurationRepository.save(configuration);
    }
}
