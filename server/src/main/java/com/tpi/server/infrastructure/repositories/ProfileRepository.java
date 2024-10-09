package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.models.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    List<Profile> findByUserId(Integer userId);
}