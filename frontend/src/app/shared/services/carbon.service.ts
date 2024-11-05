import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TotalEnergy } from '../../routes/carbon-footprint/models/totalEnergy.models';
import { interval, Observable, switchMap } from 'rxjs';
import { UserService } from './user.service';



@Injectable({
  providedIn: 'root'
})
export class CarbonService {

  //0.4 kg CO₂/kWh ó promedio segun Excel Secretaria de Energia
  // 0.572 kg

  emissionFactor : number = 0.4;

  private apiUrl = 'http://localhost:8080/api/measurements';

  private selectedDevice: string | null = null;

  constructor(private http: HttpClient, private userService: UserService) {

    this.userService.selectedDevice$.subscribe(deviceId => {
      this.selectedDevice = deviceId;
    });

  }
  
  getTotalKwh(userId: number, startTime: Date, endTime: Date, deviceId: string = this.selectedDevice || ''): Observable<TotalEnergy> {
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('startTime', startTime.toISOString())  // Formato ISO 8601
      .set('endTime', endTime.toISOString());

    if (deviceId) {
      params = params.set('deviceId', deviceId);
    }

    return this.http.get<TotalEnergy>(`${this.apiUrl}/total-energy`, { params });

  }

  getTotalKwhRealTime(userId: number, startTime: Date, pollingInterval: number = 4000): Observable<TotalEnergy> {
    return interval(pollingInterval).pipe(
      switchMap(() => {
        const endTime = new Date(); // Actualizar endTime aquí
        return this.getTotalKwh(userId, startTime, endTime);
      })
    );
  }

}
