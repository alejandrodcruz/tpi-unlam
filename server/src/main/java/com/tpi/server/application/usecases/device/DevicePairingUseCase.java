package com.tpi.server.application.usecases.device;

import com.tpi.server.domain.models.Address;
import com.tpi.server.domain.models.Device;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.exceptions.AddressNotFoundException;
import com.tpi.server.infrastructure.exceptions.AddressNotOwnedByUserException;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
import com.tpi.server.infrastructure.repositories.AddressRepository;
import com.tpi.server.infrastructure.repositories.DeviceRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DevicePairingUseCase {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public boolean pairDevice(String pairingCode, Integer userId, String name, Long addressId) {
        Device device = deviceRepository.findByPairingCode(pairingCode);
        if (device != null && !device.isAssigned()) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException(userId));
            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new AddressNotFoundException(addressId));

            if (!address.getUser().getId().equals(userId)) {
                throw new AddressNotOwnedByUserException(addressId, userId);
            }

            device.setUser(user);
            device.setAssigned(true);
            device.setPairingCode(null);
            device.setName(name);
            device.setAddress(address);
            deviceRepository.save(device);
            return true;
        } else {
            return false;
        }
    }
}
