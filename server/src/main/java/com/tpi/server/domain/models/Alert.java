package com.tpi.server.domain.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tpi.server.domain.enums.AlertType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "alerts")
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "device_id")
    private String deviceId;

    private AlertType type;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private String date;

    private double value;

}
