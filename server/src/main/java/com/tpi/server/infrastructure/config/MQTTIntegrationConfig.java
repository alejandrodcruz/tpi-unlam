package com.tpi.server.infrastructure.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tpi.server.application.usecases.mqtt.MeasurementUseCase;
import com.tpi.server.domain.models.Measurement;
import com.tpi.server.infrastructure.config.security.SslUtil;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${MQTT_BROKER}")
    private String mqttBroker;
    @Value("${MQTT_CLIENT_ID}")
    private String mqttClientId;
    @Value("${MQTT_USERNAME}")
    private String mqttUsername;
    @Value("${MQTT_PASSWORD}")
    private String mqttPassword;

    @Bean
    public MqttPahoClientFactory mqttClientFactory() throws Exception {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();

        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{mqttBroker});
        options.setUserName(mqttUsername);
        options.setPassword(mqttPassword.toCharArray());
        options.setSocketFactory(SslUtil.getSocketFactory(null, null, null)); // SslUtil

        options.setCleanSession(false);
        options.setAutomaticReconnect(true); // Reconexión automática

        options.setConnectionTimeout(10);
        options.setKeepAliveInterval(20);

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
                new MqttPahoMessageDrivenChannelAdapter(mqttClientId, mqttClientFactory(), "sensor/measurements");
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