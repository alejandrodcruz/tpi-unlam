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
import org.springframework.integration.channel.PublishSubscribeChannel;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.support.ErrorMessage;

import java.io.IOException;

@Configuration
public class MQTTIntegrationConfig {

    @Value("${MQTT_BROKER_TYPE}")
    private String mqttBrokerType;

    @Value("${MQTT_BROKER_MOSQUITTO}")
    private String mqttBrokerMosquitto;

    @Value("${MQTT_BROKER_HIVEMQ}")
    private String mqttBrokerHiveMQ;

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

        // Configurar el broker dependiendo del valor de MQTT_BROKER_TYPE
        if ("hivemq".equalsIgnoreCase(mqttBrokerType)) {
            options.setServerURIs(new String[]{mqttBrokerHiveMQ});
            options.setSocketFactory(SslUtil.getSocketFactory(null, null, null));  // Configuración SSL para HiveMQ
            options.setCleanSession(false);
        } else {
            // Configuración para Mosquitto (con tcp:// en lugar de mqtt://)
            options.setServerURIs(new String[]{mqttBrokerMosquitto});
            options.setCleanSession(true);
        }

        options.setUserName(mqttUsername);
        options.setPassword(mqttPassword.toCharArray());
        options.setAutomaticReconnect(true);
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
        System.out.println("MQTT Adapter started with clientId: " + mqttClientId + " and broker: "
                + ("hivemq".equalsIgnoreCase(mqttBrokerType) ? mqttBrokerHiveMQ : mqttBrokerMosquitto));

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

    // Canal de error para capturar y mostrar errores relacionados con MQTT
    @Bean
    public MessageChannel errorChannel() {
        return new PublishSubscribeChannel();
    }

    @ServiceActivator(inputChannel = "errorChannel")
    public void errorHandler(ErrorMessage errorMessage) {
        System.err.println("Error in MQTT connection: " + errorMessage);
    }
}
