package com.tpi.server.infrastructure.controllers.user;

import com.tpi.server.application.usecases.user.AddAddressUseCase;
import com.tpi.server.application.usecases.user.GetUserAddressesUseCase;
import com.tpi.server.domain.models.Address;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final GetUserAddressesUseCase getUserAddressesUseCase;
    private final AddAddressUseCase addAddressUseCase;

    @GetMapping("/user/{userId}")
    public List<Address> getAddressesByUser(@PathVariable Integer userId) {
        return getUserAddressesUseCase.execute(userId);
    }

    @PostMapping("/user/{userId}")
    public Address addAddress(@PathVariable Integer userId, @RequestBody Address address) {
        return addAddressUseCase.execute(address, userId);
    }
}