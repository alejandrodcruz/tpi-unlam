import { Injectable } from '@angular/core';
import {interval, map, Observable, switchMap} from 'rxjs';
import { HttpService } from '../utils/httpService';

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
  private controller = 'measurements';
  private deviceId: string | null = null;

  constructor(private httpService: HttpService) {
  }

  setDeviceId(deviceId: string) {
    this.deviceId = deviceId;
  }

  getDeviceId(): string | null {
    return this.deviceId;
  }

  getUserMeasurements(userId: number, fields: string[], timeRange: string = '1h'): Observable<Measurement[]> {
    const params: Record<string, string> = {
      userId: userId.toString(),
      fields: fields.join(','),
      timeRange: timeRange,
    };

    if (this.deviceId) {
      params['deviceId'] = this.deviceId;
    }

    return this.httpService.get<Measurement[]>(this.controller, params);
  }

  getTotalEnergy(userId: number, fields: string[], timeRange: string = '1h'): Observable<number> {
    const params: Record<string, string> = {
      userId: userId.toString(),
      fields: fields.join(','),
      timeRange: timeRange,
    };

    if (this.deviceId) {
      params['deviceId'] = this.deviceId;
    }
    return this.httpService.get<Measurement[]>(this.controller, params).pipe(
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
