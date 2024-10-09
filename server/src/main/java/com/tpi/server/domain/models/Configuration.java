package com.tpi.server.domain.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Configuration {

    @Id
    @GeneratedValue
    private Long id;

    private String key;
    private String value;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}