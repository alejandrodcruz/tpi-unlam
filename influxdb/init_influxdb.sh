#!/bin/bash
sleep 5

influx bucket create -n aggregated_energy -o "$DOCKER_INFLUXDB_INIT_ORG" --retention "$INFLUXDB_INIT_RETENTION" \
  -t "$DOCKER_INFLUXDB_INIT_ADMIN_TOKEN"

influx task create \
  --file /docker-entrypoint-initdb.d/aggregate_task.flux \
  --org "$DOCKER_INFLUXDB_INIT_ORG" \
  --token "$DOCKER_INFLUXDB_INIT_ADMIN_TOKEN"