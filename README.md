# Trabajo Practico Integrador - UNLAM

## Docker Compose
A continuación se detallan los comandos para gestionar los contenedores Docker en este proyecto:
* Descargar e instalar Docker desde https://www.docker.com/
### Servicios configurados:
* mySQL
* phpMyAdmin (aunque pueden usar DBeaver,Workbench,etc)
### Levantar los Contenedores
Levanta y construye los servicios definidos en el archivo `docker-compose.yml`:

```bash
docker-compose up --build -d
```
### Detener y Eliminar Contenedores
```bash
docker-compose down -v
```
### Reiniciar Contenedores
```bash
docker-compose down
docker-compose up --build
```
### Ver Logs de MySQL
```bash
docker-compose logs mysql
```
### Ver Logs de phpMyAdmin
```bash
docker-compose logs phpmyadmin
```