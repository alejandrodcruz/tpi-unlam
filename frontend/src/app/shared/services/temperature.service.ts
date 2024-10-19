import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {interval, map, Observable, switchMap} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {
  private url = 'http://localhost:8080/api/measurements?fields=temperature&timeRange=24h&userId=1';

  constructor(private http: HttpClient,private authService: AuthService) {
  }

  getTemperature(): Observable<number> {

    return interval(5000).pipe(
    switchMap(() => this.http.get<any[]>(this.url)),

      map((response: any[]) => {
        if (response && response.length > 0 && response[0].temperature !== undefined) {
          return response[0].temperature;
        } else {
          console.error('Error: El array de respuesta está vacío o no contiene el campo "temperature".');
        return 0;
        }
      })
    );
  }
}
