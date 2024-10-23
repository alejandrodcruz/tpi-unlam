import subprocess

from flask import Flask, request, jsonify, render_template
import mysql.connector

app = Flask(__name__)

# Ejecuta el script MQTT Simulator
def iniciar_mqtt_simulator():
    subprocess.Popen(['python', 'MQTTSimulator.py'])

iniciar_mqtt_simulator()

# Recibe los POST del html de los botones
def conectar_base_datos():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="tpifinal",
            port=3306
        )
        return connection
    except mysql.connector.Error as err:
        print(f"No se pudo conectar a la base de datos: {err}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/activar_dispositivo', methods=['POST'])
def activar_dispositivo():
    device = request.json
    device_id = device.get('deviceId')

    if not device_id:
        return jsonify({'status': 'error', 'message': 'deviceId no proporcionado'}), 400

    conn = conectar_base_datos()
    if conn:
        cursor = conn.cursor()
        try:
            cursor.execute("UPDATE device SET user_id=null")
            conn.commit()
            cursor.execute("UPDATE device_configuration SET device_id=%s", (device_id,))
            conn.commit()
            cursor.execute("UPDATE device SET user_id=1 WHERE device_id=%s", (device_id,))
            conn.commit()

            return jsonify({'status': 'success', 'message': f'Dispositivo {device_id} activado y asociado al usuario 1.'})
        except mysql.connector.Error as err:
            print(f"Error en la base de datos: {err}")  # Imprime el error en la consola
            return jsonify({'status': 'error', 'message': str(err)}), 500
        except Exception as e:
            print(f"Error inesperado: {e}")  # Imprime el error en la consola
            return jsonify({'status': 'error', 'message': 'Error inesperado.'}), 500
        finally:
            cursor.close()
            conn.close()
    return jsonify({'status': 'error', 'message': 'No se pudo conectar a la base de datos'}), 500
if __name__ == '__main__':
    app.run(debug=True)
