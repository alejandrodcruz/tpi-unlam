package com.tpi.server.user;

import com.tpi.server.application.usecases.user.DeleteAddressUseCase;
import com.tpi.server.infrastructure.exceptions.AddressNotFoundException;
import com.tpi.server.infrastructure.repositories.AddressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.Mockito.*;

class DeleteAddressUseCaseTest {

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private DeleteAddressUseCase deleteAddressUseCase;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void execute_AddressExists_DeletesAddress() {
        when(addressRepository.existsById(1L)).thenReturn(true);
        doNothing().when(addressRepository).deleteById(1L);
        deleteAddressUseCase.execute(1L);
        verify(addressRepository, times(1)).existsById(1L);
        verify(addressRepository, times(1)).deleteById(1L);
    }

    @Test
    void execute_AddressDoesNotExist_ThrowsAddressNotFoundException() {
        // Arrange
        Long nonExistentAddressId = 2L;
        when(addressRepository.existsById(nonExistentAddressId)).thenReturn(false);

        // Act & Assert
        AddressNotFoundException exception = assertThrows(AddressNotFoundException.class, () -> {
            deleteAddressUseCase.execute(nonExistentAddressId);
        });

        assertEquals("Dirección con ID " + nonExistentAddressId + " no encontrada", exception.getMessage());
        verify(addressRepository, times(1)).existsById(nonExistentAddressId);
        verify(addressRepository, never()).deleteById(anyLong());
    }
}
