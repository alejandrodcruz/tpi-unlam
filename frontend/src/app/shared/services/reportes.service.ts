import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import {HttpService} from "../utils/httpService";

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private controller = 'reports';

  constructor(private httpService: HttpService) { }
  //constructor(private http: HttpClient) {}

  getGraficoUrl(type: string, startDate: string, endDate: string): Observable<string> {
    const body = {
      type: type,
      startDate: startDate,
      endDate: endDate
    };
    return this.httpService.post<string>(body, `${this.controller}/graphic-report`).pipe(
      catchError((error) => {
        console.error('Error en getGraficoUrl:', error);
        return of('Error al obtener la URL del gráfico.');
      })
    );
  }
}

