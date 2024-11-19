package com.tpi.server.user;

import com.tpi.server.application.usecases.user.GetUserAddressesUseCase;
import com.tpi.server.domain.models.Address;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.exceptions.NoAddressesFoundException;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
import com.tpi.server.infrastructure.repositories.AddressRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GetUserAddressesUseCaseTest {

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GetUserAddressesUseCase getUserAddressesUseCase;

    private User user;
    private Address address1;
    private Address address2;
    private List<Address> addresses;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = User.builder()
                .id(1)
                .username("usuarioEjemplo")
                .email("usuario@gmail.com")
                .hasCompletedOnboarding(true)
                .build();

        address1 = Address.builder()
                .id(1L)
                .street("Calle 1")
                .city("Ciudad 1")
                .country("País 1")
                .user(user)
                .build();

        address2 = Address.builder()
                .id(2L)
                .street("Calle 2")
                .city("Ciudad 2")
                .country("País 2")
                .user(user)
                .build();

        addresses = Arrays.asList(address1, address2);
    }

    @Test
    void execute_ReturnsListOfAddresses() {
        Integer userId = 1;
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(addressRepository.findByUserId(userId)).thenReturn(addresses);

        List<Address> result = getUserAddressesUseCase.execute(userId);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.containsAll(addresses));

        verify(userRepository, times(1)).findById(userId);
        verify(addressRepository, times(1)).findByUserId(userId);
    }

    @Test
    void execute_UserDoesNotExist_ThrowsUserNotFoundException() {
        Integer nonExistentUserId = 2;
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            getUserAddressesUseCase.execute(nonExistentUserId);
        });

        assertEquals("Usuario con ID " + nonExistentUserId + " no existe.", exception.getMessage());

        verify(userRepository, times(1)).findById(nonExistentUserId);
        verify(addressRepository, never()).findByUserId(anyInt());
    }

    @Test
    void execute_UserExistsButHasNoAddresses_ThrowsNoAddressesFoundException() {
        Integer userId = 1;
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(addressRepository.findByUserId(userId)).thenReturn(Collections.emptyList());

        NoAddressesFoundException exception = assertThrows(NoAddressesFoundException.class, () -> {
            getUserAddressesUseCase.execute(userId);
        });

        assertEquals("El usuario con ID " + userId + " no tiene direcciones asociadas.", exception.getMessage());

        verify(userRepository, times(1)).findById(userId);
        verify(addressRepository, times(1)).findByUserId(userId);
    }
}