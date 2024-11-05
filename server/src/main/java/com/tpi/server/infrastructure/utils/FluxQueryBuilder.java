package com.tpi.server.infrastructure.utils;

import java.util.List;
import java.util.stream.Collectors;

public class FluxQueryBuilder {

    public static String buildGetMeasurementsQuery(String bucket, List<String> deviceIds, List<String> fields, String timeRange) {
        String devicesFilter = formatListForFlux(deviceIds);
        String fieldsFilter = formatListForFlux(fields);

        return String.format(
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
    }

    public static String buildTotalEnergyConsumptionQuery(String bucket, List<String> deviceIds, String startTime, String endTime, String deviceId) {
        String devicesFilter = (deviceId != null && !deviceId.isEmpty())
                ? String.format("\"%s\"", deviceId)
                : formatListForFlux(deviceIds);

        return String.format(
                "from(bucket:\"%s\") " +
                        "|> range(start: %s, stop: %s) " +
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"measurements\") " +
                        "|> filter(fn: (r) => %s) " +
                        "|> filter(fn: (r) => r[\"_field\"] == \"energy\") " +
                        "|> aggregateWindow(every: 1h, fn: sum, createEmpty: false) " +
                        "|> sum()",
                bucket,
                startTime,
                endTime,
                buildDeviceFilter(deviceId, deviceIds)
        );
    }

    public static String buildEnergyConsumptionPerDeviceQuery(String bucket, List<String> deviceIds, String startTime, String endTime) {
        String devicesFilter = formatListForFlux(deviceIds);

        return String.format(
                "from(bucket:\"%s\") " +
                        "|> range(start: %s, stop: %s) " +
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"measurements\") " +
                        "|> filter(fn: (r) => contains(value: r[\"deviceId\"], set: [%s])) " +
                        "|> filter(fn: (r) => r[\"_field\"] == \"energy\") " +
                        "|> aggregateWindow(every: 1h, fn: sum, createEmpty: false) " +
                        "|> group(columns: [\"deviceId\"]) " +
                        "|> sum()",
                bucket,
                startTime,
                endTime,
                devicesFilter
        );
    }

    private static String buildDeviceFilter(String deviceId, List<String> deviceIds) {
        if (deviceId != null && !deviceId.isEmpty()) {
            return String.format("r[\"deviceId\"] == \"%s\"", deviceId);
        } else {
            String devicesFilter = formatListForFlux(deviceIds);
            return String.format("contains(value: r[\"deviceId\"], set: [%s])", devicesFilter);
        }
    }

    private static String formatListForFlux(List<String> items) {
        return items.stream()
                .map(id -> "\"" + id + "\"")
                .collect(Collectors.joining(","));
    }
}