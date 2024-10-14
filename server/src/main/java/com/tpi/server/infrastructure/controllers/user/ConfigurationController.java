package com.tpi.server.infrastructure.controllers.user;

import com.tpi.server.application.usecases.user.AddConfigurationUseCase;
import com.tpi.server.application.usecases.user.GetUserConfigurationsUseCase;
import com.tpi.server.domain.models.UserConfiguration;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/configurations")
@RequiredArgsConstructor
public class ConfigurationController {

    private final GetUserConfigurationsUseCase getUserConfigurationsUseCase;
    private final AddConfigurationUseCase addConfigurationUseCase;

    @GetMapping("/user/{userId}")
    public List<UserConfiguration> getConfigurationsByUser(@PathVariable Integer userId) {
        return getUserConfigurationsUseCase.execute(userId);
    }

    @PostMapping("/user/{userId}")
    public UserConfiguration addConfiguration(@PathVariable Integer userId, @RequestBody UserConfiguration configuration) {
        return addConfigurationUseCase.execute(configuration, userId);
    }
}
