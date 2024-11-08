import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {HttpService} from "../utils/httpService";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  //private apiUrl = 'http://localhost:8080/configurations';
  private controller = 'configurations';

  constructor(private httpService: HttpService) { }

  getAlertSettings(deviceId: string): Observable<any> {
    return this.httpService.post({ deviceId }, `${this.controller}/device`);
  }

  updateAlertSettings(alertSettings: any): Observable<any> {
    console.log('paso por el servicio', alertSettings);
    return this.httpService.post(alertSettings, `${this.controller}/update-device`);
  }
}
