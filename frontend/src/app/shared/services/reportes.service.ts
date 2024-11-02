import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  constructor(private http: HttpClient) {}

  getGraficoUrl(type: string, startDate: string, endDate: string): Observable<string> {

    const url = `http://lytics.dyndns.org:8080/reports/graphic-report `;

    const body = {
      type: type,
      startDate: startDate,
      endDate: endDate
    };

    return this.http.post<string>(url, body).pipe(
      catchError((error) => {
        console.error('Error en getGraficoUrl:', error);
        return of('Error al obtener la URL del gráfico.');
      })
    );
  }
}

