package com.tpi.server.infrastructure.mappers;
import com.influxdb.query.FluxTable;
import com.tpi.server.domain.enums.MeasurementField;
import com.tpi.server.domain.models.Measurement;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class MeasurementMapper {

    public static List<Measurement> fromFluxTables(List<FluxTable> tables, List<String> fields) {
        return tables.stream()
                .flatMap(table -> table.getRecords().stream())
                .map(record -> {
                    Measurement measurement = new Measurement();
                    measurement.setDeviceId((String) record.getValueByKey("deviceId"));
                    measurement.setTimestamp(record.getTime().toString());

                    Map<String, Object> values = record.getValues();

                    fields.stream()
                            .map(values::get)
                            .filter(value -> value instanceof Number)
                            .map(value -> ((Number) value).doubleValue())
                            .forEach(numericValue -> {
                                String fieldName = getFieldNameFromValue(values, numericValue);
                                MeasurementField measurementField = MeasurementField.fromFieldName(fieldName);
                                if (measurementField != null) {
                                    measurementField.setField(measurement, numericValue);
                                }
                            });

                    return measurement;
                })
                .collect(Collectors.toList());
    }

    public static Map<String, Double> mapEnergyConsumptionPerDevice(List<FluxTable> tables) {
        return tables.stream()
                .flatMap(table -> table.getRecords().stream())
                .collect(Collectors.toMap(
                        record -> (String) record.getValueByKey("deviceId"),
                        record -> {
                            Object value = record.getValue();
                            return value instanceof Number ? ((Number) value).doubleValue() / 1000.0 : 0.0;
                        },
                        Double::sum
                ));
    }

    private static String getFieldNameFromValue(Map<String, Object> values, double numericValue) {
        return values.entrySet().stream()
                .filter(entry -> entry.getValue() instanceof Number)
                .filter(entry -> ((Number) entry.getValue()).doubleValue() == numericValue)
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse(null);
    }
}
