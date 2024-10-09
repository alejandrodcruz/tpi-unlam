package com.tpi.server.infrastructure.controllers.user;

import com.tpi.server.application.usecases.user.AddProfileUseCase;
import com.tpi.server.application.usecases.user.GetUserProfilesUseCase;
import com.tpi.server.domain.models.Profile;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final GetUserProfilesUseCase getUserProfilesUseCase;
    private final AddProfileUseCase addProfileUseCase;

    @GetMapping("/user/{userId}")
    public List<Profile> getProfilesByUser(@PathVariable Integer userId) {
        return getUserProfilesUseCase.execute(userId);
    }

    @PostMapping("/user/{userId}")
    public Profile addProfile(@PathVariable Integer userId, @RequestBody Profile profile) {
        return addProfileUseCase.execute(profile, userId);
    }
}