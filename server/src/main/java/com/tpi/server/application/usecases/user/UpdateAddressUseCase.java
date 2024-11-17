package com.tpi.server.application.usecases.user;

import com.tpi.server.domain.models.Address;
import com.tpi.server.infrastructure.exceptions.AddressNotFoundException;
import com.tpi.server.infrastructure.repositories.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class UpdateAddressUseCase {

    private final AddressRepository addressRepository;

    @Transactional
    public Address execute(Long addressId, Address updatedAddress) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AddressNotFoundException(addressId));

        address.setStreet(updatedAddress.getStreet());
        address.setCity(updatedAddress.getCity());
        address.setCountry(updatedAddress.getCountry());
        return addressRepository.save(address);
    }
}

