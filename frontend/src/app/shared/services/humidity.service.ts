import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, interval, switchMap, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HumidityService {
  private url = 'http://localhost:8080/api/measurements?fields=humidity&timeRange=24h&userId=1';

  constructor(private http: HttpClient) {
  }

  getHumidity(): Observable<number> {

    return interval(5000).pipe(
      switchMap(() => this.http.get<any[]>(this.url)),
      map((response: any[]) => {
        if (response && response.length > 0 && response[0].humidity !== undefined) {
          return response[0].humidity;
        } else {

          return 0; // Valor por defecto si no hay datos
        }
      })
    );
  }
}
