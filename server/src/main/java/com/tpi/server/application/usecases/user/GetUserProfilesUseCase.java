package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.Profile;
import com.tpi.server.infrastructure.exceptions.NoProfilesFoundException;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
import com.tpi.server.infrastructure.repositories.ProfileRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GetUserProfilesUseCase {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public List<Profile> execute(Integer userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        List<Profile> profiles = profileRepository.findByUserId(userId);

        if (profiles.isEmpty()) {
            throw new NoProfilesFoundException(userId);
        }

        return profiles;
    }
}