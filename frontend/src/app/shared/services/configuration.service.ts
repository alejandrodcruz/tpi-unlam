import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {environment} from "../../../environments/ environment";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: HttpClient) {}

  getAlertSettings(deviceId: string): Observable<any> {
    const body = { deviceId };
    return this.http.post(`${environment.apiUrl}/configurations/device`, body);
  }

  updateAlertSettings(alertSettings: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/configurations/update-device`, alertSettings);
  }
}
