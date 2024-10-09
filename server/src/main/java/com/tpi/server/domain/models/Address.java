package com.tpi.server.domain.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Address {

    @Id
    @GeneratedValue
    private Long id;

    private String street;
    private String city;
    private String country;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
