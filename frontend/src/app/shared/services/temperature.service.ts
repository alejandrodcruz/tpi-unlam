import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {interval, map, Observable, switchMap} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {
  private url = 'http://localhost:8080/api/measurements?fields=temperature&timeRange=24h&userId=1';

  // Token del usuario
  private token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGVqYW5kcm8iLCJpYXQiOjE3MjkwMzc3MjYsImV4cCI6MTcyOTAzOTE2Nn0.l9p02oH4zyQ2rZOklpSYHTQIQP41tfu4sUcB7ovqBWY';



  constructor(private http: HttpClient,private authService: AuthService) {
  }

  // Método que hace la solicitud periódicamente
  getTemperature(): Observable<number> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return interval(5000).pipe(
      switchMap(() => this.http.get<any[]>(this.url, {headers})), // Asegúrate de que la respuesta sea un array si es necesario

      map((response: any[]) => {
        if (response && response.length > 0 && response[0].temperature !== undefined) {
          return response[0].temperature;
        } else {
          console.error('Error: El array de respuesta está vacío o no contiene el campo "temperature".');
          return 0; // Valor por defecto si no hay datos
        }
      })
    );
  }
}
