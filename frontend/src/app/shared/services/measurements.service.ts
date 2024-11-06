import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {WebSocketService} from "./web-socket.service";

export interface Measurement {
  deviceId: string;
  voltage: number;
  current: number; //amperaje
  power: number; // watts
  energy: number; //
  temperature: number;
  humidity: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class MeasurementsService {
  private apiUrl = 'http://localhost:8080/measurements';
  private deviceId: string | null = null;

  constructor(private http: HttpClient,
              private webSocketService: WebSocketService) {
  }

  setDeviceId(deviceId: string) {
    this.deviceId = deviceId;
  }

  getTotalEnergy(userId: number, fields: string[], timeRange: string = '1h'): Observable<number> {
    let params = new HttpParams()
      .set('userId', userId)
      .set('fields', fields.join(','))
      .set('timeRange', timeRange);

      if (this.deviceId) {
        params = params.set('deviceId', this.deviceId);
      }

    return this.http.get<Measurement[]>(this.apiUrl, {params}).pipe(
      map(measurements => {
        return measurements.reduce((totalEnergy, measurement) => totalEnergy + measurement.energy, 0);
      })
    );
  }

  startMeasurentsUpdates(userId: number): Observable<void> {
    const fields = ['voltage', 'current', 'power', 'energy'];
    const timeRange = '10s';

    let params = new HttpParams()
      .set('userId', userId)
      .set('fields', fields.join(','))
      .set('timeRange', timeRange)
      .set('deviceId', this.deviceId || '');


    return this.http.post<void>(`${this.apiUrl}/start-measurements`, {}, { params });
  }

  getUserMeasurementsRealTime(): Observable<Measurement[]> {
      return this.webSocketService.listenMeasurentsTopic().pipe(
        map((message: any) => {
          return JSON.parse(message.body) as Measurement[];
        })
      );
  }
}
