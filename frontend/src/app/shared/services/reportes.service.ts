import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor() { }

  getGrafico(): string {

    const grafanaBaseUrl = 'https://grafico.com/d-solo/dashboardUID/panelUID';
    const queryParams = '?orgId=1&from=now-30d&to=now&theme=light';
    return `${grafanaBaseUrl}${queryParams}`;
  }
}
