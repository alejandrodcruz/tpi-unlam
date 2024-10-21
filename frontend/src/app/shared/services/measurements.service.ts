import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {interval, map, Observable, switchMap} from 'rxjs';

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
  private apiUrl = 'http://localhost:8080/api/measurements';

  constructor(private http: HttpClient) {
  }

  getUserMeasurements(userId: number, fields: string[], timeRange: string = '1h'): Observable<Measurement[]> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('fields', fields.join(','))
      .set('timeRange', timeRange);

    return this.http.get<Measurement[]>(this.apiUrl, {params});
  }

  getTotalEnergy(userId: number, fields: string[], timeRange: string = '1h'): Observable<number> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('fields', fields.join(','))
      .set('timeRange', timeRange);

    return this.http.get<Measurement[]>(this.apiUrl, {params}).pipe(
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
