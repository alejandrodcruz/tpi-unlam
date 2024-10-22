package com.tpi.server.user;

import com.tpi.server.application.usecases.user.GetUserAddressesUseCase;
import com.tpi.server.domain.models.Address;
import com.tpi.server.infrastructure.repositories.AddressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GetUserAddressesUseCaseTest {

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private GetUserAddressesUseCase getUserAddressesUseCase;

    private List<Address> addresses;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        Address address1 = Address.builder()
                .id(1L)
                .street("Calle 1")
                .city("Ciudad 1")
                .country("País 1")
                .build();

        Address address2 = Address.builder()
                .id(2L)
                .street("Calle 2")
                .city("Ciudad 2")
                .country("País 2")
                .build();

        addresses = Arrays.asList(address1, address2);
    }

    @Test
    void execute_ReturnsListOfAddresses() {
        when(addressRepository.findByUserId(1)).thenReturn(addresses);
        List<Address> result = getUserAddressesUseCase.execute(1);
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(addressRepository, times(1)).findByUserId(1);
    }

    @Test
    void execute_NoAddresses_ReturnsEmptyList() {
        when(addressRepository.findByUserId(2)).thenReturn(List.of());
        List<Address> result = getUserAddressesUseCase.execute(2);
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(addressRepository, times(1)).findByUserId(2);
    }
}
