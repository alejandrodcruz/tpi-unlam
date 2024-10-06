import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private apiUrl = 'http://localhost:8080/alerts';

  constructor(private http: HttpClient) {}

  updateAlertSettings(alertSettings: any): Observable<any> {
    console.log( 'paso por el servicio ', alertSettings );
    return this.http.post(`${this.apiUrl}/update-alerts`, alertSettings);
  }

  getAlertSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-alerts`);
  }
}
