import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface DeviceUser{
  deviceId: number;
  pairingCode: string;
  assigned: true;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private API_URL = 'http://localhost:8080/api';
  //dispo
  private devicesSubject = new BehaviorSubject<DeviceUser[]>([]);
  public devices$ = this.devicesSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService ) { }

  getUserDevices(): Observable<DeviceUser[]> {
    const userId = this.authService.getUserId();

    if (!userId) {
      throw new Error("No se ha encontrado el userId");
    }

    return this.http.get<DeviceUser[]>(`${this.API_URL}/devices/user/${userId}`).pipe(
      tap(devices => this.devicesSubject.next(devices))
    );
  }

  pairDevice(pairingCode: string, nameDevice: string, addressId: number): Observable<any> {
    const userId = this.authService.getUserId();

    if (userId === null) {
      throw new Error("No se ha encontrado el userId");
    }
    const body = {
      pairingCode: pairingCode,
      userId: userId,
      name: nameDevice,
      addressId: addressId
    };
    return this.http.post<any>(`${this.API_URL}/pair-device`, body);
  }
}
