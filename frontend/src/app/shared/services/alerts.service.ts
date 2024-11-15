import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpService} from "../utils/httpService";

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private controller = 'alerts';

  constructor(private httpService: HttpService) { }

  updateAlertSettings(alertSettings: any): Observable<any> {
    console.log('paso por el servicio', alertSettings);
    return this.httpService.post(alertSettings, `${this.controller}/update-alerts`);
  }

  getAlertSettings(): Observable<any> {
    return this.httpService.get(`${this.controller}/get-alerts`);
  }

  getAlertsForDeviceId(deviceId: string): Observable<any> {
    const body = { deviceId };
    return this.httpService.post({ body }, `alert/getUserAlerts`);
  }


}
