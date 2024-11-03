package com.tpi.server.infrastructure.mappers;

import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.tpi.server.domain.enums.MeasurementField;
import com.tpi.server.domain.models.Measurement;
import lombok.Getter;

import java.util.Arrays;
import java.util.Objects;

public class MeasurementPointMapper {

    public static Point toPoint(Measurement measurement) {
        Point point = Point.measurement("measurements")
                .addTag("deviceId", measurement.getDeviceId())
                .time(System.currentTimeMillis(), WritePrecision.MS);

        Arrays.stream(MeasurementField.values())
                .map(field -> {
                    Double value = field.getGetter().apply(measurement);
                    return value != null ? new FieldValue(field.getFieldName(), value) : null;
                })
                .filter(Objects::nonNull)
                .forEach(fieldValue -> point.addField(fieldValue.getFieldName(), fieldValue.getValue()));

        return point;
    }

    @Getter
    private static class FieldValue {
        private final String fieldName;
        private final Double value;

        public FieldValue(String fieldName, Double value) {
            this.fieldName = fieldName;
            this.value = value;
        }

    }
}