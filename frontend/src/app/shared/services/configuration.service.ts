import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private apiUrl = 'http://lytics.dyndns.org:8080/configurations';

  constructor(private http: HttpClient) {}

  getAlertSettings(deviceId: string): Observable<any> {
    const body = { deviceId };
    return this.http.post(`${this.apiUrl}/device`, body);
  }

  updateAlertSettings(alertSettings: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-device`, alertSettings);
  }
}
