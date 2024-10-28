package com.tpi.server.infrastructure.repositories;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.influxdb.client.QueryApi;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import com.tpi.server.domain.models.Measurement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class InfluxDBMeasurementRepository implements MeasurementRepository {

    private final InfluxDBClient influxDBClient;

    @Value("${INFLUXDB_BUCKET}")
    private String bucket;

    public InfluxDBMeasurementRepository(InfluxDBClient influxDBClient) {
        this.influxDBClient = influxDBClient;
    }

    @Override
    public void save(Measurement measurement) {
        Point point = Point.measurement("measurements")
                .addTag("deviceId", measurement.getDeviceId())
                .addField("voltage", measurement.getVoltage())
                .addField("current", measurement.getCurrent())
                .addField("power", measurement.getPower())
                .addField("energy", measurement.getEnergy())
                .addField("temperature", measurement.getTemperature())
                .addField("humidity", measurement.getHumidity())
                .time(System.currentTimeMillis(), WritePrecision.MS);

        influxDBClient.getWriteApiBlocking().writePoint(point);
    }

    @Override
    public List<Measurement> getMeasurements(List<String> deviceIds, List<String> fields, String timeRange) {
        if (deviceIds.isEmpty() || fields.isEmpty()) {
            return new ArrayList<>();
        }

        String devicesFilter = String.join("\",\"", deviceIds);
        devicesFilter = "\"" + devicesFilter + "\"";

        String fieldsFilter = String.join("\",\"", fields);
        fieldsFilter = "\"" + fieldsFilter + "\"";

        String fluxQuery = String.format(
                "from(bucket:\"%s\") " +
                        "|> range(start: -%s) " +
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"measurements\") " +
                        "|> filter(fn: (r) => contains(value: r[\"deviceId\"], set: [%s])) " +
                        "|> filter(fn: (r) => contains(value: r[\"_field\"], set: [%s])) " +
                        "|> pivot(rowKey:[\"_time\"], columnKey:[\"_field\"], valueColumn:\"_value\")",
                bucket,
                timeRange,
                devicesFilter,
                fieldsFilter
        );

        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);

        List<Measurement> measurements = new ArrayList<>();
        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                Measurement measurement = new Measurement();
                measurement.setDeviceId((String) record.getValueByKey("deviceId"));
                measurement.setTimestamp(record.getTime().toString());

                if (fields.contains("voltage")) {
                    Object voltage = record.getValueByKey("voltage");
                    if (voltage != null) measurement.setVoltage(((Number) voltage).doubleValue());
                }

                if (fields.contains("current")) {
                    Object current = record.getValueByKey("current");
                    if (current != null) measurement.setCurrent(((Number) current).doubleValue());
                }

                if (fields.contains("power")) {
                    Object power = record.getValueByKey("power");
                    if (power != null) measurement.setPower(((Number) power).doubleValue());
                }

                if (fields.contains("energy")) {
                    Object energy = record.getValueByKey("energy");
                    if (energy != null) measurement.setEnergy(((Number) energy).doubleValue());
                }

                if (fields.contains("temperature")) {
                    Object temperature = record.getValueByKey("temperature");
                    if (temperature != null) measurement.setTemperature(((Number) temperature).doubleValue());
                }

                if (fields.contains("humidity")) {
                    Object humidity = record.getValueByKey("humidity");
                    if (humidity != null) measurement.setHumidity(((Number) humidity).doubleValue());
                }
                measurements.add(measurement);
            }
        }
        return measurements;
    }

    @Override
    public double getTotalEnergyConsumption(List<String> deviceIds, String startTime, String endTime, String deviceId) {
        if (deviceIds.isEmpty()) {
            return 0.0;
        }

        Instant start = Instant.parse(startTime);
        Instant end = Instant.parse(endTime);
        Duration period = Duration.between(start, end);

        String bucketToQuery;
        String measurement;

        if (period.toHours() <= 24) {
            bucketToQuery = "grupo10bucket";
            measurement = "measurements";
        } else {
            bucketToQuery = "aggregated_energy";
            measurement = "measurements";
        }

        String devicesFilter = deviceId != null && !deviceId.isEmpty() ?
                "\"" + deviceId + "\"" :
                deviceIds.stream().map(id -> "\"" + id + "\"").collect(Collectors.joining(","));

        String fluxQuery = String.format(
                "from(bucket:\"%s\") " +
                        "|> range(start: %s, stop: %s) " +
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"%s\") " +
                        "|> filter(fn: (r) => contains(value: r[\"deviceId\"], set: [%s])) " +
                        "|> filter(fn: (r) => r[\"_field\"] == \"energy\") " +
                        "|> sum()",
                bucketToQuery,
                startTime,
                endTime,
                measurement,
                devicesFilter
        );

        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);

        double totalEnergy = tables.stream()
                .flatMap(table -> table.getRecords().stream())
                .mapToDouble(record -> {
                    Object value = record.getValue();
                    return value != null ? ((Number) value).doubleValue() : 0.0;
                })
                .sum() / 1000.0; // Wh a kWh

        return totalEnergy;
    }

    @Override
    public Map<String, Double> getTotalEnergyConsumptionPerDevice(List<String> deviceIds, String startTime, String endTime) {
        Map<String, Double> deviceConsumption = new HashMap<>();
        if (deviceIds.isEmpty()) {
            return deviceConsumption;
        }

        Instant start = Instant.parse(startTime);
        Instant end = Instant.parse(endTime);
        Duration period = Duration.between(start, end);

        String bucketToQuery;
        String measurement;

        if (period.toHours() <= 24) {
            bucketToQuery = "grupo10bucket";
            measurement = "measurements";
        } else {
            bucketToQuery = "aggregated_energy";
            measurement = "measurements";
        }

        String devicesFilter = deviceIds.stream().map(id -> "\"" + id + "\"").collect(Collectors.joining(","));

        String fluxQuery = String.format(
                "from(bucket:\"%s\") " +
                        "|> range(start: %s, stop: %s) " +
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"%s\") " +
                        "|> filter(fn: (r) => contains(value: r[\"deviceId\"], set: [%s])) " +
                        "|> filter(fn: (r) => r[\"_field\"] == \"energy\") " +
                        "|> group(columns: [\"deviceId\"]) " +
                        "|> sum()",
                bucketToQuery,
                startTime,
                endTime,
                measurement,
                devicesFilter
        );

        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);

        tables.forEach(table -> {
            for (FluxRecord record : table.getRecords()) {
                String deviceId = (String) record.getValueByKey("deviceId");
                Object value = record.getValue();
                if (deviceId != null && value != null) {
                    double energy = ((Number) value).doubleValue() / 1000.0; // Wh a kWh
                    deviceConsumption.put(deviceId, energy);
                }
            }
        });
        return deviceConsumption;
    }
}