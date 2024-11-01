import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Observable, of, switchMap } from 'rxjs';

export interface DeviceDetail {
  deviceId: string;
  totalEnergy: number;
  energyCost: number;
  name: string;
}

export interface TotalEnergyResponse {
  totalEnergy: number;
  energyCost: number;
  devicesDetails: DeviceDetail[];
}


@Injectable({
  providedIn: 'root'
})
export class ConsumptionService {
  private apiUrl = 'http://localhost:8080/api/measurements';
  private selectedDevice: string | null = null;

  constructor(private http: HttpClient, private userService: UserService) {
    this.userService.selectedDevice$.subscribe((deviceId) => {
      this.selectedDevice = deviceId;
    });
  }

  getTotalKwhAndConsumption(userId: number, startTime: Date, endTime: Date, deviceId: string = this.selectedDevice || ''): Observable<TotalEnergyResponse> {
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('startTime', startTime.toISOString())
      .set('endTime', endTime.toISOString());

    if (deviceId) {
      params = params.set('deviceId', deviceId);
    }

    return this.http.get<TotalEnergyResponse>(`${this.apiUrl}/total-energy`, { params });
  }

  // Consumo del último día
getLastDayConsumption(userId: number, deviceId: string): Observable<number> {
  const endTime = new Date();
  const startTime = new Date();
  startTime.setDate(endTime.getDate()-1); // Hace 1 día

  return this.getTotalKwhAndConsumption(userId, startTime, endTime, deviceId).pipe(
    switchMap(response => of(response.energyCost))
  );
}

// Consumo del mes actual
getCurrentMonthConsumption(userId: number, deviceId: string): Observable<number> {
  const endTime = new Date();
  const startTime = new Date(endTime.getFullYear(), endTime.getMonth(), 1); // Primer día del mes actual

  return this.getTotalKwhAndConsumption(userId, startTime, endTime, deviceId).pipe(
    switchMap(response => of(response.energyCost))
  );
}

// Consumo del mes anterior
getPreviousMonthConsumption(userId: number, deviceId: string): Observable<number> {
  const endTime = new Date(new Date().setDate(0)); // Último día del mes anterior
  const startTime = new Date(endTime.getFullYear(), endTime.getMonth(), 1); // Primer día del mes anterior

  return this.getTotalKwhAndConsumption(userId, startTime, endTime, deviceId).pipe(
    switchMap(response => of(response.energyCost))
  );
}

// Proyección para el mes actual
getProjectedCurrentMonthConsumption(userId: number, deviceId: string): Observable<number> {
  const endTime = new Date();
  const startTime = new Date(endTime.getFullYear(), endTime.getMonth(), 1); // Primer día del mes actual
  const daysInMonth = new Date(endTime.getFullYear(), endTime.getMonth() + 1, 0).getDate();
  const daysElapsed = endTime.getDate();

  return this.getTotalKwhAndConsumption(userId, startTime, endTime, deviceId).pipe(
    switchMap(response => {
      const projectedConsumption = (response.energyCost / daysElapsed) * daysInMonth;
      return of(projectedConsumption);
    })
  );
}

}
