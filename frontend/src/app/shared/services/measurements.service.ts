import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {interval, map, Observable, switchMap} from 'rxjs';
import {environment} from "../../../environments/ environment";

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
  private deviceId: string | null = null;

  constructor(private http: HttpClient) {
  }

  setDeviceId(deviceId: string) {
    this.deviceId = deviceId;
  }

  getDeviceId(): string | null {
    return this.deviceId;
  }

  getUserMeasurements(userId: number, fields: string[], timeRange: string = '1h'): Observable<Measurement[]> {
    let params = new HttpParams()
      .set('userId', userId)
      .set('fields', fields.join(','))
      .set('timeRange', timeRange);

      if (this.deviceId) {
        params = params.set('deviceId', this.deviceId);
      }
    return this.http.get<Measurement[]>(`${environment.apiUrl}/api/measurements`, {params});
  }

  getTotalEnergy(userId: number, fields: string[], timeRange: string = '1h'): Observable<number> {
    let params = new HttpParams()
      .set('userId', userId)
      .set('fields', fields.join(','))
      .set('timeRange', timeRange);

      if (this.deviceId) {
        params = params.set('deviceId', this.deviceId);
      }

    return this.http.get<Measurement[]>(`${environment.apiUrl}/api/measurements`, {params}).pipe(
      map(measurements => {
        return measurements.reduce((totalEnergy, measurement) => totalEnergy + measurement.energy, 0);
      })
    );
  }

  getUserMeasurementsRealTime(userId: number, fields: string[], timeRange: string = '1h', pollingInterval: number = 5000): Observable<Measurement[]> {
    return interval(pollingInterval).pipe(
      switchMap(() => this.getUserMeasurements(userId, fields, timeRange))
    );
  }
}
