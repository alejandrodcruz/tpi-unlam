import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  constructor(private http: HttpClient) {}

  getGraficoUrl(type: string, startDate: string, endDate: string): Observable<string> {
    console.log("se recibe en el servicio: tipo " + type + " fecha inicio " + startDate + " fecha final " + endDate);

    const url = `http://localhost:8080/reports/graphic-report `;

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

