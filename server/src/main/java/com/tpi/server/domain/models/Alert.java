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

    private String name;

    private AlertType type;

    @JsonFormat(pattern="dd-MM-yyyy HH:mm")
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;


    private double value;

}
