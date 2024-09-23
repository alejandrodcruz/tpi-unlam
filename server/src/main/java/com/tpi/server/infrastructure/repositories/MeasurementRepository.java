package com.tpi.server.infrastructure.repositories;

import com.tpi.server.domain.models.Measurement;

public interface MeasurementRepository {
    void save(Measurement measurement);
}