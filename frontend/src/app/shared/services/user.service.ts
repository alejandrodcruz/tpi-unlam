import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../domain/user';
import { HttpService } from '../utils/httpService';

export interface Device {
  deviceId: string;
  pairingCode: string;
  assigned: true;
  name: string;
  lastDayConsumption?: number;
  currentMonthConsumption?: number;
  previousMonthConsumption?: number;
  projectedCurrentMonthConsumption?: number;
  savingsPercentage?: number;
  isSaving?: boolean;
  monetaryDifference?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private controller = 'user';

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  private selectedDeviceSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public selectedDevice$: Observable<string> = this.selectedDeviceSubject.asObservable();

  private selectedDeviceNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public selectedDeviceName$: Observable<string> = this.selectedDeviceNameSubject.asObservable();

  constructor(private authService: AuthService, private httpService: HttpService) {}

  getUserDevices(): Observable<Device[]> {
    const userId = this.authService.getUserId();

    if (userId !== null) {
      return this.httpService.get<Device[]>(`devices/user/${userId}`, false);
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
      this.httpService.get<User>(`${this.controller}/${userId}`).subscribe((user) => {
        this.userSubject.next(user);
      });
    }
  }

}
