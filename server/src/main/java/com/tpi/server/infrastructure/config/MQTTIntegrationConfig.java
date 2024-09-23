package com.tpi.server.infrastructure.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tpi.server.application.usecases.mqtt.MeasurementUseCase;
import com.tpi.server.domain.models.Measurement;
import com.tpi.server.infrastructure.config.security.SslUtil;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

import java.io.IOException;

@Configuration
public class MQTTIntegrationConfig {

    private static final String MQTT_BROKER = "ssl://9b25823fe85840dfa7b0afa24977a140.s1.eu.hivemq.cloud:8883";
    private static final String MQTT_CLIENT_ID = "SpringBootClient";

    @Bean
    public MqttPahoClientFactory mqttClientFactory() throws Exception {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();

        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{MQTT_BROKER});
        options.setUserName("alejandro");
        options.setPassword("Mosquitto+2023".toCharArray());
        options.setSocketFactory(SslUtil.getSocketFactory(null, null, null)); // SslUtil

        options.setConnectionTimeout(10);
        options.setKeepAliveInterval(20);
        options.setCleanSession(true);

        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MqttPahoMessageDrivenChannelAdapter inbound() throws Exception {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter(MQTT_CLIENT_ID, mqttClientFactory(), "sensor/measurements");
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler handler(MeasurementUseCase measurementUseCase) {
        return message -> {
            String payload = message.getPayload().toString();
            System.out.println("Mensaje recibido: " + payload);
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                Measurement measurement = objectMapper.readValue(payload, Measurement.class);
                measurementUseCase.processMeasurement(measurement);
            } catch (IOException e) {
                e.printStackTrace();
                System.err.println("Error al parsear el mensaje: " + e.getMessage());
            }
        };
    }
}