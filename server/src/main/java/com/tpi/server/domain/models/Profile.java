package com.tpi.server.domain.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Profile {

    @Id
    @GeneratedValue
    private Long id;

    private String profileName;
    private String preferences; // Puedes utilizar un campo JSON si es complejo

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}