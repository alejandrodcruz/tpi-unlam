package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.Address;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.exceptions.NoAddressesFoundException;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
import com.tpi.server.infrastructure.repositories.AddressRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GetUserAddressesUseCase {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<Address> execute(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        List<Address> addresses = addressRepository.findByUserId(userId);

        if (addresses.isEmpty()) {
            throw new NoAddressesFoundException(userId);
        }
        return addresses;
    }
}
