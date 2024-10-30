option task = {
  name: "AggregateHourlyEnergy",
  every: 1h,
  offset: 0m
}

from(bucket: "grupo10bucket")
  |> range(start: -task.every)
  |> filter(fn: (r) => r["_measurement"] == "measurements")
  |> filter(fn: (r) => r["_field"] == "energy")
  |> group(columns: ["deviceId"])
  |> aggregateWindow(every: 1h, fn: sum, createEmpty: false)
  |> map(fn: (r) => ({
      r with
      _measurement: "measurements",
      _field: "energy"
    }))
  |> to(bucket: "aggregated_energy", org: "grupo10", tagColumns: ["deviceId"])
