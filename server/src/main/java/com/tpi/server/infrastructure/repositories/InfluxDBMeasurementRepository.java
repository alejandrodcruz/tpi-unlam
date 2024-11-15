package com.tpi.server.infrastructure.repositories;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.QueryApi;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxTable;
import com.tpi.server.domain.models.Measurement;
import com.tpi.server.infrastructure.mappers.MeasurementMapper;
import com.tpi.server.infrastructure.mappers.MeasurementPointMapper;
import com.tpi.server.infrastructure.utils.FluxQueryBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class InfluxDBMeasurementRepository implements MeasurementRepository {

    private final InfluxDBClient influxDBClient;

    @Value("${INFLUXDB_BUCKET_REALTIME}")
    private String realtimeBucket;

    @Value("${INFLUXDB_BUCKET_HISTORIC}")
    private String historicBucket;

    @Override
    public void save(Measurement measurement) {
        Point point = MeasurementPointMapper.toPoint(measurement);
        influxDBClient.getWriteApiBlocking().writePoint(point);
    }

    @Override
    public List<Measurement> getMeasurements(List<String> deviceIds, List<String> fields, String timeRange) {
        String fluxQuery = FluxQueryBuilder.buildGetMeasurementsQuery(realtimeBucket, deviceIds, fields, timeRange);
        return executeMeasurementQuery(fluxQuery, fields);
    }

    @Override
    public double getTotalEnergyConsumption(List<String> deviceIds, String startTime, String endTime, String deviceId) {
        String fluxQuery = FluxQueryBuilder.buildTotalEnergyConsumptionQuery(
                realtimeBucket, deviceIds, startTime, endTime, deviceId);
        return executeEnergyConsumptionQuery(fluxQuery);
    }

    @Override
    public Map<String, Double> getTotalEnergyConsumptionPerDevice(List<String> deviceIds, String startTime, String endTime) {
        String fluxQuery = FluxQueryBuilder.buildEnergyConsumptionPerDeviceQuery(
                realtimeBucket, deviceIds, startTime, endTime);
        return executeEnergyConsumptionPerDeviceQuery(fluxQuery);
    }

    // Metodos privados para ejecutar las consultas y mapear los resultados
    private List<Measurement> executeMeasurementQuery(String fluxQuery, List<String> fields) {
        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);
        return MeasurementMapper.fromFluxTables(tables, fields);
    }

    private double executeEnergyConsumptionQuery(String fluxQuery) {
        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);

        return tables.stream()
                .flatMap(table -> table.getRecords().stream())
                .mapToDouble(record -> {
                    Object value = record.getValue();
                    return value != null ? ((Number) value).doubleValue() : 0.0;
                })
                .sum() / 1000.0; // Convertir de Wh a kWh
    }

    private Map<String, Double> executeEnergyConsumptionPerDeviceQuery(String fluxQuery) {
        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);

        return MeasurementMapper.mapEnergyConsumptionPerDevice(tables);
    }
}