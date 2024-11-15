import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpService} from "../utils/httpService";
import {Address} from "./address.service";

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

  /*getAlertsForDeviceId(deviceId: string): Observable<any> {
    const body = { deviceId };
    return this.http.post(`http://localhost:8080/alert/getUserAlerts`, body);
  }*/// CHEQUEAR ESTE SERVICIO CON NICO

  getAlertsForDeviceId(deviceId: string): Observable<any> {
    return this.httpService.post({ deviceId }, `alert/getUserAlerts`);
  }


}
