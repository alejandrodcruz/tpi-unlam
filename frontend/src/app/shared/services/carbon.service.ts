import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TotalEnergy } from '../../routes/carbon-footprint/models/totalEnergy.models';
import { interval, Observable, switchMap } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CarbonService {

  //0.4 kg CO₂/kWh ó promedio segun Excel Secretaria de Energia
  // 0.572 kg

  emissionFactor : number = 0.4;

  private apiUrl = 'http://localhost:8080/api/measurements';

  constructor(private http: HttpClient) { }


  getTotalKwh(userId: number, startTime: Date, endTime: Date, deviceId?: string): Observable<TotalEnergy> {
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('startTime', startTime.toISOString())  // Formato ISO 8601
      .set('endTime', endTime.toISOString());

    if (deviceId) {
      params = params.set('deviceId', deviceId);
    }

    return this.http.get<TotalEnergy>(`${this.apiUrl}/total-energy`, { params });

  }
  getTotalKwhRealTime(userId: number, startTime: Date, endTime: Date, pollingInterval: number = 5000, deviceId?: string): Observable<TotalEnergy> {
    return interval(pollingInterval).pipe(
      switchMap(() => this.getTotalKwh(userId, startTime, endTime, deviceId))
    );
  }
}
