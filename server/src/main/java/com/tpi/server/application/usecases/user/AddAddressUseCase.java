package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.Address;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.repositories.AddressRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AddAddressUseCase {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public Address execute(Address address, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        address.setUser(user);
        return addressRepository.save(address);
    }
}
