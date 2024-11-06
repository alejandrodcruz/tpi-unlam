import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TotalEnergy } from '../../routes/carbon-footprint/models/totalEnergy.models';
import { map, Observable } from 'rxjs';
import { UserService } from './user.service';
import {WebSocketService} from "./web-socket.service";



@Injectable({
  providedIn: 'root'
})
export class CarbonService {

  //0.4 kg CO₂/kWh ó promedio segun Excel Secretaria de Energia
  // 0.572 kg

  emissionFactor : number = 0.4;

  private apiUrl = 'http://localhost:8080/measurements';

  private selectedDevice: string | null = null;

  constructor(private http: HttpClient,
              private userService: UserService,
              private webSocketService: WebSocketService) {

    this.userService.selectedDevice$.subscribe(deviceId => {
      this.selectedDevice = deviceId;
    });

  }

  startEnergyUpdates(userId: number, startTime: Date): Observable<void> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('startTime', startTime.toISOString())
      .set('endTime', new Date().toISOString())
      .set('deviceId', this.selectedDevice || '');

    return this.http.post<void>(`${this.apiUrl}/start-energy`, {}, { params });
  }

  getTotalKwhRealTime(): Observable<TotalEnergy> {
    return this.webSocketService.listenConsumeTopic().pipe(
      map((message: any) => {
        return JSON.parse(message.body) as TotalEnergy;
      })
    );
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

}
