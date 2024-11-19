package com.tpi.server.user;

import com.tpi.server.application.usecases.user.AddAddressUseCase;
import com.tpi.server.domain.models.Address;
import com.tpi.server.domain.models.User;
import com.tpi.server.infrastructure.exceptions.UserNotFoundException;
import com.tpi.server.infrastructure.repositories.AddressRepository;
import com.tpi.server.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AddAddressUseCaseTest {

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AddAddressUseCase addAddressUseCase;

    private User user;
    private Address addressToAdd;
    private Address savedAddress;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = User.builder()
                .id(1)
                .username("usuarioEjemplo")
                .email("usuario@gmail.com")
                .hasCompletedOnboarding(true)
                .build();

        addressToAdd = Address.builder()
                .street("Calle Ejemplo")
                .city("Ciudad Ejemplo")
                .country("País Ejemplo")
                .build();

        savedAddress = Address.builder()
                .id(1L)
                .street("Calle Ejemplo")
                .city("Ciudad Ejemplo")
                .country("País Ejemplo")
                .user(user)
                .build();
    }

    @Test
    void userExistsAddsAndReturnsAddress() {
        // Arrange
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(addressRepository.save(any(Address.class))).thenReturn(savedAddress);

        // Act
        Address result = addAddressUseCase.execute(addressToAdd, 1);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Calle Ejemplo", result.getStreet());
        verify(userRepository, times(1)).findById(1);
        verify(addressRepository, times(1)).save(addressToAdd);
        assertEquals(user, result.getUser());
    }

    @Test
    void userDoesNotExistThrowsUserNotFoundException() {
        // Arrange
        Integer nonExistentUserId = 2;
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        // Act & Assert
        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            addAddressUseCase.execute(addressToAdd, nonExistentUserId);
        });

        assertEquals("Usuario con ID " + nonExistentUserId + " no existe.", exception.getMessage());
        verify(userRepository, times(1)).findById(nonExistentUserId);
        verify(addressRepository, never()).save(any(Address.class));
    }
}