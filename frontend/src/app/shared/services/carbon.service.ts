import { Injectable } from '@angular/core';
import { TotalEnergy } from '../../routes/carbon-footprint/models/totalEnergy.models';
import { interval, Observable, switchMap } from 'rxjs';
import { UserService } from './user.service';
import { HttpService } from '../utils/httpService';


@Injectable({
  providedIn: 'root'
})
export class CarbonService {

  //0.4 kg CO₂/kWh ó promedio segun Excel Secretaria de Energia
  // 0.572 kg

  emissionFactor : number = 0.4;

  private selectedDevice: string | null = null;

  constructor(private httpService: HttpService, private userService: UserService) {

    this.userService.selectedDevice$.subscribe(deviceId => {
      this.selectedDevice = deviceId;
    });

  }

  getTotalKwh(userId: number, startTime: Date, endTime: Date): Observable<TotalEnergy> {
    const params: { userId: string; startTime: string; endTime: string; deviceId?: string } = {
      userId: userId.toString(),
      startTime: startTime.toISOString(), // Formato ISO 8601
      endTime: endTime.toISOString(),
    };

    return this.httpService.get<TotalEnergy>('measurements/total-energy', params, false);
  }

  getTotalKwhRealTime(userId: number, startTime: Date, pollingInterval: number = 10000): Observable<TotalEnergy> {
    return interval(pollingInterval).pipe(
      switchMap(() => {
        const endTime = new Date(); // Actualizar endTime aquí
        return this.getTotalKwh(userId, startTime, endTime);
      })
    );
  }

}
