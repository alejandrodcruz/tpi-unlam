import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpService } from '../utils/httpService';

export interface DeviceUser {
  deviceId: string;
  pairingCode: string;
  assigned: true;
  name: string;
  estimatedConsume?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private controller = 'devices';

  private devicesSubject = new BehaviorSubject<DeviceUser[]>([]);
  public devices$ = this.devicesSubject.asObservable();

  constructor(private httpService: HttpService, private authService: AuthService) { }

  getUserDevices(): Observable<DeviceUser[]> {
    const userId = this.authService.getUserId();

    if (!userId) {
      throw new Error("No se ha encontrado el userId");
    }

    return this.httpService.get<DeviceUser[]>(`${this.controller}/user/${userId}`).pipe(
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

    return this.httpService.post<any>(body, `${this.controller}/pair-device`);
  }

  updateDevice(deviceId: string, name: string): Observable<DeviceUser> {
    const body = { name: name };
    return this.httpService.put<DeviceUser>(body, `${this.controller}/${deviceId}`);
  }

  deleteDevice(deviceId: string): Observable<any> {
    return this.httpService.delete<any>(`${this.controller}/${deviceId}`).pipe(
      tap(() => {
        // Elimina el dispositivo de la lista local después de eliminarlo del backend
        const updatedDevices = this.devicesSubject.value.filter(device => device.deviceId !== deviceId);
        this.devicesSubject.next(updatedDevices);
      })
    );
  }
}
