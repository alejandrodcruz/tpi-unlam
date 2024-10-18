package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.Profile;
import com.tpi.server.infrastructure.repositories.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GetUserProfilesUseCase {

    private final ProfileRepository profileRepository;

    public List<Profile> execute(Integer userId) {
        return profileRepository.findByUserId(userId);
    }
}