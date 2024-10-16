import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, interval, switchMap, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HumidityService {
  private url = 'http://localhost:8080/api/measurements?fields=humidity&timeRange=24h&userId=1';

  // Token del usuario
  private token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGVqYW5kcm8iLCJpYXQiOjE3MjkwNDU5MTIsImV4cCI6MTcyOTA0NzM1Mn0.29pbkXrMZrCKinsLxutbEFWdRUuMxyZh5k6qMQOsWbo';

  constructor(private http: HttpClient) {
  }

  // Método que hace la solicitud periódicamente y obtiene solo el dato de humedad
  getHumidity(): Observable<number> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return interval(5000).pipe(
      switchMap(() => this.http.get<any[]>(this.url, {headers})), // Cambiado a any[] si es un array
      map((response: any[]) => {
        if (response && response.length > 0 && response[0].humidity !== undefined) {
          return response[0].humidity;
        } else {
          console.error('Error: El array de respuesta está vacío o no contiene el campo "humidity".');
          return 0; // Valor por defecto si no hay datos
        }
      })
    );
  }
}
