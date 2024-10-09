package com.tpi.server.domain.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_configuration")
public class Configuration {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "config_key")
    private String key;

    @Column(name = "config_value")
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}