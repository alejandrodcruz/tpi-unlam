import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  constructor(private http: HttpClient) {}

  // reportes.service.ts
  getReporteDatos(type: string, startDate: string, endDate: string): Observable<any[]> {
    const url = `http://localhost:8080/reports/data-report`;

    const body = {
      type: type,
      startDate: startDate,
      endDate: endDate
    };

    return this.http.post<any[]>(url, body).pipe(
      catchError((error) => {
        console.error('Error en getReporteDatos:', error);
        return of([]);
      })
    );
  }
}

