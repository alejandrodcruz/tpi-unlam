package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.Profile;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
import com.tpi.server.infrastructure.repositories.ProfileRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AddProfileUseCase {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public Profile execute(Profile profile, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        profile.setUser(user);
        return profileRepository.save(profile);
    }
}
