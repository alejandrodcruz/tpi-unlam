import json
import time
import random
import paho.mqtt.client as mqtt
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')

devices = [
    {"deviceId": "08:A6:F7:24:71:98", "name": "Heladera", "power": 350},
    {"deviceId": "08:A6:F7:24:71:99", "name": "Aire Acondicionado", "power": 1200},
    {"deviceId": "08:A6:F7:24:71:9A", "name": "Microondas", "power": 1000},
    {"deviceId": "08:A6:F7:24:71:9B", "name": "Lavarropas", "power": 500},
    {"deviceId": "08:A6:F7:24:71:9C", "name": "Televisor", "power": 150},
    {"deviceId": "08:A6:F7:24:71:9D", "name": "Computadora", "power": 200},
    {"deviceId": "08:A6:F7:24:71:9E", "name": "Lámpara LED", "power": 20},
    {"deviceId": "08:A6:F7:24:71:9F", "name": "Ventilador", "power": 60},
    {"deviceId": "08:A6:F7:24:71:A0", "name": "Cargador de Celular", "power": 10},
    {"deviceId": "08:A6:F7:24:71:A1", "name": "Router WiFi", "power": 15},
    {"deviceId": "08:A6:F7:24:71:A2", "name": "Lavavajillas", "power": 1800},
    {"deviceId": "08:A6:F7:24:71:A3", "name": "Secador de Pelo", "power": 1500},
    {"deviceId": "08:A6:F7:24:71:A4", "name": "Calefactor Eléctrico", "power": 2000},
    {"deviceId": "08:A6:F7:24:71:A5", "name": "Plancha", "power": 1200},
    {"deviceId": "08:A6:F7:24:71:A6", "name": "Cafetera", "power": 800},
    {"deviceId": "08:A6:F7:24:71:A7", "name": "Extractor de Aire", "power": 150},
    {"deviceId": "08:A6:F7:24:71:A8", "name": "Horno Eléctrico", "power": 1500},
    {"deviceId": "08:A6:F7:24:71:A9", "name": "Bomba de Agua", "power": 750},
    {"deviceId": "08:A6:F7:24:71:AA", "name": "Radiador Eléctrico", "power": 2000},
    {"deviceId": "08:A6:F7:24:71:AB", "name": "Impresora Láser", "power": 500}
]

# Generar datos del dispositivo
def generate_device_data(device):
    # Variación de los Watts
    varied_power = device["power"] + random.uniform(0, 0)

    voltage = random.uniform(210, 230)
    current = varied_power / voltage
    energy = (varied_power * (5 / 3600))
    temperature = random.uniform(20, 30)
    humidity = random.uniform(30, 50)

    # Formateeo de la fecha
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # Tratamiento pre envio
    measurements = {
        "deviceId": device["deviceId"],
        "voltage": round(voltage, 4),
        "current": round(current, 2),
        "power": round(varied_power, 4),
        "energy": round(energy, 6),
        "temperature": round(temperature, 1),
        "humidity": round(humidity, 1),
        "timestamp": timestamp
    }

    return measurements

# Verificar conexion con Mosquitto
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logging.info("Conexión exitosa al broker MQTT")
    else:
        logging.error(f"Error en la conexión al broker MQTT, código {rc}")

def on_disconnect(client, userdata, rc):
    logging.warning("Desconectado del broker MQTT. Intentando reconectar...")
    while rc != 0:
        try:
            client.reconnect()
            logging.info("Reconectado al broker MQTT")
            break
        except:
            logging.error("Error al intentar reconectar. Reintentando en 5 segundos...")
            time.sleep(5)

# Configuracion
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_disconnect = on_disconnect

# Reintentos de conexion
while True:
    try:
        mqtt_client.connect("localhost", 1883, 60)
        break
    except Exception as e:
        logging.error(f"No se pudo conectar al broker MQTT: {e}. Reintentando en 5 segundos...")
        time.sleep(5)

mqtt_client.loop_start()

# Publicacion de los Json a Mosquitto
while True:
    for device in devices:
        device_data = generate_device_data(device)
        device_json = json.dumps(device_data)
        mqtt_client.publish("sensor/measurements", device_json)

        # Log
        logging.info(f"Enviando datos del dispositivo {device['name']}: {device_json}")
    # Envia cada 2 segundos
    time.sleep(5)

# Ejecutar en terminal de esta forma - python MQTTSimulator.py