export const environment = {
  production: true,
  server: 'localhost',
  angularPort: 4200,
  influxdbPort: 8086,
  grafanaPort: 3000,
  springPort: 8080,
  mysqlPort: 3306,

  apiUrl: `http://${this.server}:${this.springPort}`,
  influxdbUrl: `http://${this.server}:${this.influxdbPort}`,
  grafanaUrl: `http://${this.server}:${this.grafanaPort}`
};
