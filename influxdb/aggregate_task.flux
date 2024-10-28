// aggregate_task.flux

option task = {
  name: "AggregateHourlyEnergy",
  every: 1h,
  offset: 0m
}

data = from(bucket: "grupo10bucket")
  |> range(start: -task.every)
  |> filter(fn: (r) => r._measurement == "measurements")
  |> filter(fn: (r) => r._field == "energy")
  |> group(columns: ["deviceId"])
  |> sum()

data
  |> to(bucket: "aggregated_energy", org: "grupo10", tagColumns: ["deviceId"])
