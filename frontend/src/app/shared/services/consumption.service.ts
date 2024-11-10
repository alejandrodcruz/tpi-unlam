import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { HttpService } from '../utils/httpService';

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
  private selectedDevice: string | null = null;

  constructor(private httpService: HttpService, private userService: UserService) {
    this.userService.selectedDevice$.subscribe((deviceId) => {
      this.selectedDevice = deviceId;
    });
  }

  getTotalKwhAndConsumption(userId: number, startTime: Date, endTime: Date, deviceId: string = this.selectedDevice || ''): Observable<TotalEnergyResponse> {
    const params: Record<string, string> = {
      userId: userId.toString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    if (deviceId) {
      params['deviceId'] = deviceId;
    }

    return this.httpService.get<TotalEnergyResponse>('measurements/total-energy', params, false);
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

// Proyección para el mes actual usando el consumo del último día
getProjectedCurrentMonthConsumption(userId: number, deviceId: string): Observable<number> {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysElapsed = today.getDate();
  const daysRemaining = daysInMonth - daysElapsed;

  return forkJoin({
    currentMonthConsumption: this.getCurrentMonthConsumption(userId, deviceId),
    lastDayConsumption: this.getLastDayConsumption(userId, deviceId)
  }).pipe(
    map(({ currentMonthConsumption, lastDayConsumption }) => {
      const projectedConsumption = currentMonthConsumption + (lastDayConsumption * daysRemaining);
      return projectedConsumption;
    })
  );
}
}
