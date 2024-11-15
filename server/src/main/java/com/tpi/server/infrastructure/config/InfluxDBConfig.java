package com.tpi.server.infrastructure.config;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InfluxDBConfig {

    @Value("${INFLUXDB_TOKEN}")
    private String token;
    @Value("${INFLUXDB_ORG}")
    private String org;
    @Value("${INFLUXDB_BUCKET_REALTIME}")
    private String bucket;
    @Value("${INFLUXDB_URL}")
    private String url;

    @Bean
    public InfluxDBClient influxDBClient() {
        return InfluxDBClientFactory.create(url, token.toCharArray(), org, bucket);
    }
}