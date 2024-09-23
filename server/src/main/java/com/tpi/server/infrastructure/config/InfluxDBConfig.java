package com.tpi.server.infrastructure.config;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InfluxDBConfig {

    private static final String TOKEN = "grupo10token";
    private static final String ORG = "grupo10";
    private static final String BUCKET = "grupo10bucket";
    private static final String URL = "http://localhost:8086"; // Esta usando el Docker

    @Bean
    public InfluxDBClient influxDBClient() {
        return InfluxDBClientFactory.create(URL, TOKEN.toCharArray(), ORG, BUCKET);
    }
}