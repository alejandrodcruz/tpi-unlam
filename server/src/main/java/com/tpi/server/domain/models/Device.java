package com.tpi.server.domain.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Device {

    @Id
    private String deviceId;
    private String pairingCode;
    private boolean assigned;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}