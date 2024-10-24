package com.tpi.server.user;

import com.tpi.server.application.usecases.user.UpdateAddressUseCase;
import com.tpi.server.domain.models.Address;
import com.tpi.server.infrastructure.repositories.AddressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UpdateAddressUseCaseTest {

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private UpdateAddressUseCase updateAddressUseCase;

    private Address existingAddress;
    private Address updatedAddressData;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        existingAddress = Address.builder()
                .id(1L)
                .street("Calle Antigua")
                .city("Ciudad Antigua")
                .country("País Antiguo")
                .build();

        updatedAddressData = Address.builder()
                .street("Calle Nueva")
                .city("Ciudad Nueva")
                .country("País Nuevo")
                .build();
    }

    @Test
    void addressExistsUpdatesAndReturnsAddress() {
        when(addressRepository.findById(1L)).thenReturn(Optional.of(existingAddress));
        when(addressRepository.save(existingAddress)).thenReturn(existingAddress);
        Address result = updateAddressUseCase.execute(1L, updatedAddressData);
        assertNotNull(result);
        assertEquals("Calle Nueva", result.getStreet());
        assertEquals("Ciudad Nueva", result.getCity());
        assertEquals("País Nuevo", result.getCountry());

        verify(addressRepository, times(1)).findById(1L);
        verify(addressRepository, times(1)).save(existingAddress);
    }

    @Test
    void addressDoesNotExistThrowsRuntimeException() {
        when(addressRepository.findById(2L)).thenReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            updateAddressUseCase.execute(2L, updatedAddressData);
        });

        assertEquals("Dirección no encontrada", exception.getMessage());
        verify(addressRepository, times(1)).findById(2L);
        verify(addressRepository, never()).save(any(Address.class));
    }
}
