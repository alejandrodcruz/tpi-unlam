import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { AuthService } from './auth.service';

export interface Device {
  deviceId: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:8080/api';

  private selectedDeviceSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  selectedDevice$: Observable<string> = this.selectedDeviceSubject.asObservable();

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  getUserDevices(): Observable<Device[]> {
    const userId = this.authService.getUserId();

    if (userId !== null) {
      return this.httpClient.get<Device[]>(`${this.url}/devices/user/${userId}`);
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
}
