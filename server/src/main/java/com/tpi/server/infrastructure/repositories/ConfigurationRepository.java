package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.models.UserConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConfigurationRepository extends JpaRepository<UserConfiguration, Long> {
    List<UserConfiguration> findByUserId(Integer userId);
}