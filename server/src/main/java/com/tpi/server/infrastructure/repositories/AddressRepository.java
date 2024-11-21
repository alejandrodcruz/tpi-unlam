package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.enums.AddressType;
import com.tpi.server.domain.models.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Integer userId);
    List<Address> findByType(AddressType type);
}
