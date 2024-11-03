import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/ environment";

@Injectable({
  providedIn: 'root'
})
export class AlertsService {


  constructor(private http: HttpClient) {}

  updateAlertSettings(alertSettings: any): Observable<any> {
    console.log( 'paso por el servicio ', alertSettings );
    return this.http.post(`${environment.apiUrl}/alerts/update-alerts`, alertSettings);
  }

  getAlertSettings(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-alerts`);
  }

  getAlertsForDeviceId(deviceId: string): Observable<any> {
    const body = { deviceId };
    return this.http.post(`${environment.apiUrl}/alert/getUserAlerts`, body);
  }
}
