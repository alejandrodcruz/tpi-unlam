package com.tpi.server.infrastructure.repositories;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.tpi.server.domain.models.Measurement;
import org.springframework.stereotype.Repository;

@Repository
public class InfluxDBMeasurementRepository implements MeasurementRepository {

    private final InfluxDBClient influxDBClient;

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

        //influxDBClient.getWriteApiBlocking().writePoint(point);
    }
}