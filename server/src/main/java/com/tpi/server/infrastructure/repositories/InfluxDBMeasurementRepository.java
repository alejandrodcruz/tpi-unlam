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
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class InfluxDBMeasurementRepository implements MeasurementRepository {

    private final InfluxDBClient influxDBClient;

    @Value("${INFLUXDB_BUCKET_REALTIME}")
    private String realtimeBucket;

    @Value("${INFLUXDB_BUCKET_HISTORIC}")
    private String historicBucket;

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

        String devicesFilter = deviceIds.stream()
                .map(id -> "\"" + id + "\"")
                .collect(Collectors.joining(","));

        String fieldsFilter = fields.stream()
                .map(field -> "\"" + field + "\"")
                .collect(Collectors.joining(","));

        String fluxQuery = String.format(
                "from(bucket:\"%s\") " +
                        "|> range(start: -%s) " +
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"measurements\") " +
                        "|> filter(fn: (r) => contains(value: r[\"deviceId\"], set: [%s])) " +
                        "|> filter(fn: (r) => contains(value: r[\"_field\"], set: [%s])) " +
                        "|> pivot(rowKey:[\"_time\"], columnKey:[\"_field\"], valueColumn:\"_value\")",
                realtimeBucket,
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

                for (String field : fields) {
                    Object value = record.getValueByKey(field);
                    if (value != null && value instanceof Number) {
                        double numericValue = ((Number) value).doubleValue();
                        switch (field) {
                            case "voltage":
                                measurement.setVoltage(numericValue);
                                break;
                            case "current":
                                measurement.setCurrent(numericValue);
                                break;
                            case "power":
                                measurement.setPower(numericValue);
                                break;
                            case "energy":
                                measurement.setEnergy(numericValue);
                                break;
                            case "temperature":
                                measurement.setTemperature(numericValue);
                                break;
                            case "humidity":
                                measurement.setHumidity(numericValue);
                                break;
                        }
                    }
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
        Instant now = Instant.now();

        // Saber si es ultima hora
        Instant oneHourAgo = now.minus(Duration.ofHours(1));
        boolean includesRecentData = end.isAfter(oneHourAgo);

        double totalEnergy = 0.0;

        if (includesRecentData) {
            // fin para el bucket historico
            Instant historicEnd = start.isBefore(oneHourAgo) ? oneHourAgo : start;
            // Consultar el bucket historico si el inicio es antes del fin historico
            double energyHistoric = 0.0;
            if (start.isBefore(historicEnd)) {
                energyHistoric = queryTotalEnergyConsumption(historicBucket, deviceIds, startTime, historicEnd.toString(), deviceId);
            }

            // Calcular el inicio para el bucket en tiempo real
            Instant realtimeStart = start.isAfter(oneHourAgo) ? start : oneHourAgo;
            double energyRealtime = queryTotalEnergyConsumption(realtimeBucket, deviceIds, realtimeStart.toString(), endTime, deviceId);

            totalEnergy = energyRealtime + energyHistoric;
        } else {
            totalEnergy = queryTotalEnergyConsumption(historicBucket, deviceIds, startTime, endTime, deviceId);
        }

        return totalEnergy;
    }

    private double queryTotalEnergyConsumption(String bucket, List<String> deviceIds, String startTime, String endTime, String deviceId) {
        String devicesFilter;
        if (deviceId != null && !deviceId.isEmpty()) {
            devicesFilter = "\"" + deviceId + "\"";
        } else {
            devicesFilter = deviceIds.stream()
                    .map(id -> "\"" + id + "\"")
                    .collect(Collectors.joining(","));
        }

        String fluxQuery = String.format(
                "from(bucket:\"%s\") " +
                        "|> range(start: %s, stop: %s) " +
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"measurements\") " +
                        "|> filter(fn: (r) => contains(value: r[\"deviceId\"], set: [%s])) " +
                        "|> filter(fn: (r) => r[\"_field\"] == \"energy\") " +
                        "|> sum()",
                bucket,
                startTime,
                endTime,
                devicesFilter
        );

        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);

        return tables.stream()
                .flatMap(table -> table.getRecords().stream())
                .mapToDouble(record -> {
                    Object value = record.getValue();
                    return value != null ? ((Number) value).doubleValue() : 0.0;
                })
                .sum() / 1000.0; // Wh a kWh
    }

    @Override
    public Map<String, Double> getTotalEnergyConsumptionPerDevice(List<String> deviceIds, String startTime, String endTime) {
        Map<String, Double> deviceConsumption = new HashMap<>();
        if (deviceIds.isEmpty()) {
            return deviceConsumption;
        }

        Instant start = Instant.parse(startTime);
        Instant end = Instant.parse(endTime);
        Instant now = Instant.now();

        Instant oneHourAgo = now.minus(Duration.ofHours(1));
        boolean includesRecentData = end.isAfter(oneHourAgo);

        if (includesRecentData) {
            Instant historicEnd = start.isBefore(oneHourAgo) ? oneHourAgo : start;
            if (start.isBefore(historicEnd)) {
                Map<String, Double> historicConsumption = queryTotalEnergyConsumptionPerDevice(historicBucket, deviceIds, startTime, historicEnd.toString());
                deviceConsumption.putAll(historicConsumption);
            }

            Instant realtimeStart = start.isAfter(oneHourAgo) ? start : oneHourAgo;
            Map<String, Double> realtimeConsumption = queryTotalEnergyConsumptionPerDevice(realtimeBucket, deviceIds, realtimeStart.toString(), endTime);

            realtimeConsumption.forEach((device, energy) ->
                    deviceConsumption.merge(device, energy, Double::sum)
            );
        } else {
            Map<String, Double> historicConsumption = queryTotalEnergyConsumptionPerDevice(historicBucket, deviceIds, startTime, endTime);
            deviceConsumption.putAll(historicConsumption);
        }

        return deviceConsumption;
    }

    private Map<String, Double> queryTotalEnergyConsumptionPerDevice(String bucket, List<String> deviceIds, String startTime, String endTime) {
        String devicesFilter = deviceIds.stream()
                .map(id -> "\"" + id + "\"")
                .collect(Collectors.joining(","));

        String fluxQuery = String.format(
                "from(bucket:\"%s\") " +
                        "|> range(start: %s, stop: %s) " +
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"measurements\") " +
                        "|> filter(fn: (r) => contains(value: r[\"deviceId\"], set: [%s])) " +
                        "|> filter(fn: (r) => r[\"_field\"] == \"energy\") " +
                        "|> group(columns: [\"deviceId\"]) " +
                        "|> sum()",
                bucket,
                startTime,
                endTime,
                devicesFilter
        );

        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);

        Map<String, Double> deviceConsumption = new HashMap<>();
        tables.forEach(table -> {
            for (FluxRecord record : table.getRecords()) {
                String deviceId = (String) record.getValueByKey("deviceId");
                Object value = record.getValue();
                if (deviceId != null && value != null) {
                    double energy = ((Number) value).doubleValue() / 1000.0; // Wh a kWh
                    deviceConsumption.merge(deviceId, energy, Double::sum);
                }
            }
        });
        return deviceConsumption;
    }
}
