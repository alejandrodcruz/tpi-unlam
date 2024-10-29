package com.tpi.server.infrastructure.controllers.user;

import com.tpi.server.application.usecases.user.AddAddressUseCase;
import com.tpi.server.application.usecases.user.DeleteAddressUseCase;
import com.tpi.server.application.usecases.user.GetUserAddressesUseCase;
import com.tpi.server.application.usecases.user.UpdateAddressUseCase;
import com.tpi.server.domain.models.Address;
import com.tpi.server.infrastructure.dtos.AddressDTO;
import com.tpi.server.infrastructure.mappers.AddressMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/address")
@RequiredArgsConstructor
public class AddressController {

    private final GetUserAddressesUseCase getUserAddressesUseCase;
    private final AddAddressUseCase addAddressUseCase;
    private final UpdateAddressUseCase updateAddressUseCase;
    private final DeleteAddressUseCase deleteAddressUseCase;
    private final AddressMapper addressMapper;

    @GetMapping("/user/{userId}")
    public List<AddressDTO> getAddressesByUser(@PathVariable Integer userId) {
        List<Address> addresses = getUserAddressesUseCase.execute(userId);
        return addresses.stream()
                .map(addressMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/user/{userId}")
    public AddressDTO addAddress(@PathVariable Integer userId, @RequestBody AddressDTO addressDTO) {
        Address address = addressMapper.toEntity(addressDTO);
        Address savedAddress = addAddressUseCase.execute(address, userId);
        return addressMapper.toDTO(savedAddress);
    }

    @PutMapping("/{addressId}")
    public AddressDTO updateAddress(@PathVariable Long addressId, @RequestBody AddressDTO addressDTO) {
        Address address = addressMapper.toEntity(addressDTO);
        Address updatedAddress = updateAddressUseCase.execute(addressId, address);
        return addressMapper.toDTO(updatedAddress);
    }

    @DeleteMapping("/{addressId}")
    public void deleteAddress(@PathVariable Long addressId) {
        deleteAddressUseCase.execute(addressId);
    }
}