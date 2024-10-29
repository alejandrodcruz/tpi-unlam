import random
from datetime import datetime, timedelta
from influxdb_client import InfluxDBClient, Point, WritePrecision

INFLUXDB_URL = "http://localhost:8086"
INFLUXDB_TOKEN = "grupo10token"
INFLUXDB_ORG = "grupo10"
INFLUXDB_BUCKET = "grupo10bucket"

client = InfluxDBClient(url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG)

write_api = client.write_api()

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


def generate_device_data(device, timestamp):
    varied_power = device["power"] * random.uniform(0.9, 1.1)
    voltage = random.uniform(210, 230)
    current = varied_power / voltage
    energy = (varied_power * (2 / 3600))
    temperature = random.uniform(20, 30)
    humidity = random.uniform(30, 50)

    point = Point("measurements") \
        .tag("deviceId", device["deviceId"]) \
        .field("voltage", round(voltage, 4)) \
        .field("current", round(current, 2)) \
        .field("power", round(varied_power, 4)) \
        .field("energy", round(energy, 6)) \
        .field("temperature", round(temperature, 1)) \
        .field("humidity", round(humidity, 1)) \
        .time(timestamp, WritePrecision.NS)
    print(point.to_line_protocol())
    return point

today = datetime.now()
first_day_of_current_month = today.replace(day=1)
last_day_of_previous_month = first_day_of_current_month - timedelta(days=1)

for day in range(365):
    current_day = last_day_of_previous_month - timedelta(days=day)

    for registro in range(100):
        timestamp = current_day.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(
            minutes=registro * 1440 / 100)
        for device in devices:
            device_data = generate_device_data(device, timestamp)
            write_api.write(bucket=INFLUXDB_BUCKET, org=INFLUXDB_ORG, record=device_data)
write_api.__del__()
client.close()

print("Datos insertados en InfluxDB correctamente.")
