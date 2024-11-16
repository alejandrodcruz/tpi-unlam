package com.tpi.server.application.usecases.user;

import com.tpi.server.infrastructure.exceptions.AddressNotFoundException;
import com.tpi.server.infrastructure.repositories.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DeleteAddressUseCase {

    private final AddressRepository addressRepository;

    @Transactional
    public void execute(Long addressId) {
        if (!addressRepository.existsById(addressId)) {
            throw new AddressNotFoundException(addressId);
        }
        addressRepository.deleteById(addressId);
    }
}
