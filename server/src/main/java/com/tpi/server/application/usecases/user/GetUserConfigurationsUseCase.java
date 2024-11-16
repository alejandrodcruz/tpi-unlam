package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.UserConfiguration;
import com.tpi.server.infrastructure.exceptions.NoConfigurationsFoundException;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
import com.tpi.server.infrastructure.repositories.ConfigurationRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GetUserConfigurationsUseCase {

    private final ConfigurationRepository configurationRepository;
    private final UserRepository userRepository;

    public List<UserConfiguration> execute(Integer userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        List<UserConfiguration> configurations = configurationRepository.findByUserId(userId);

        if (configurations.isEmpty()) {
            throw new NoConfigurationsFoundException(userId);
        }

        return configurations;
    }
}