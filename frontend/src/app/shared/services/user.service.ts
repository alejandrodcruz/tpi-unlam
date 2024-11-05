import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../domain/user';

export interface Device {
  deviceId: string;
  pairingCode: string;
  assigned: true;
  name: string;

  lastDayConsumption?: number; // Consumo del último día
  currentMonthConsumption?: number; // Consumo del mes actual
  previousMonthConsumption?: number; // Consumo del mes anterior
  projectedCurrentMonthConsumption?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:8080/devices';
  private urlUser = 'http://localhost:8080/user';

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  private selectedDeviceSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public selectedDevice$: Observable<string> = this.selectedDeviceSubject.asObservable();

  private selectedDeviceNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public selectedDeviceName$: Observable<string> = this.selectedDeviceNameSubject.asObservable();

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  getUserDevices(): Observable<Device[]> {
    const userId = this.authService.getUserId();

    if (userId !== null) {
      return this.httpClient.get<Device[]>(`${this.url}/user/${userId}`);
    } else {
      return of([]);
    }
  }

  selectDevice(device: string) {
    this.selectedDeviceSubject.next(device);
  }
  getSelectedDevice(): string {
    return this.selectedDeviceSubject.value;
  }

  selectDeviceName(device: string) {
    this.selectedDeviceNameSubject.next(device);
  }
  getSelectedDeviceName(): string {
    return this.selectedDeviceNameSubject.value;
  }

  getUserData(): void {
    const userId = this.authService.getUserId();

    if (userId !== null) {
      this.httpClient.get<User>(`${this.urlUser}/${userId}`).subscribe({
        next: (user) => {
          this.userSubject.next(user);
        },
        error: (error) => {
          console.error('Error al obtener los datos del usuario:', error);
        }
      });
    }
  }

}
