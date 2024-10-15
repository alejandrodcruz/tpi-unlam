import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Measurement {
  deviceId: string;
  voltage: number;
  current: number;
  power: number;
  energy: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class MeasurementsService {
  private apiUrl = 'http://localhost:8080/api/measurements';

  constructor(private http: HttpClient) { }

  getUserMeasurements(userId: number, fields: string[], timeRange: string = '1h'): Observable<Measurement[]> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('fields', fields.join(','))
      .set('timeRange', timeRange);

    return this.http.get<Measurement[]>(this.apiUrl, { params });
  }
}
