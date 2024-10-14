import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {interval, Observable, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {
  private url = 'http://localhost:3001/temperature';

  constructor(private http: HttpClient) {}

  // Método que hace la solicitud periódicamente
  getTemperature(): Observable<any> {
    return interval(5000).pipe(
      switchMap(() => this.http.get(this.url))
    );
  }
}
