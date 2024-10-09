package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.Configuration;
import com.tpi.server.infrastructure.repositories.ConfigurationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GetUserConfigurationsUseCase {

    private final ConfigurationRepository configurationRepository;

    public List<Configuration> execute(Integer userId) {
        return configurationRepository.findByUserId(userId);
    }
}