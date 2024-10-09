package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.Address;
import com.tpi.server.infrastructure.repositories.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GetUserAddressesUseCase {

    private final AddressRepository addressRepository;

    public List<Address> execute(Integer userId) {
        return addressRepository.findByUserId(userId);
    }
}
