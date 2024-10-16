import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HumidityService {
 // private url = 'http://localhost:3000/d-solo/ae09ysbazwoowe/humidity?orgId=1&panelId=1&var-deviceId=08:A6:F7:24:71:98&refresh=5s';
  private url = 'http://localhost:3001/humidity';

  constructor(private http: HttpClient) {}

  // Método que hace la solicitud periódicamente
  getHumidity(): Observable<any> {
    return interval(5000).pipe(
      switchMap(() => this.http.get(this.url))
    );
  }
}
