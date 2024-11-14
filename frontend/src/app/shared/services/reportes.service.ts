import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import {AuthService} from "./auth.service";
import {Measurement} from "./measurements.service";

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  constructor(private http: HttpClient, private authService: AuthService) {}


  getReporteDatos(selectType: string, startDate: string, endDate: string): Observable<any[]> {
    const userId = this.authService.getUserId();
    if (userId == null) {
      console.error('Error: userId is null or undefined');
      return of([]);
    }
    let url = '';
    if(selectType == 'Consumo'){
        url = `http://localhost:8080/measurements/total-energy?userId=${userId}&startTime=${startDate}T00:00:00Z&endTime=${endDate}T00:00:00Z`;

    }else if(selectType == 'intensidad'){
        url = `http://localhost:8080/measurements?fields=current&startTime=${startDate}T00:00:00Z&endTime=${endDate}T23:59:59Z&userId=${userId}`;


    }

    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Measurement[]>(url, { params }).pipe(
      catchError((error) => {
        console.error('Error en getReporteDatos:', error);
        return of([]);
      })
    );
  }
/*  getReporteDatos(selectType: string, startDate: string, endDate: string): Observable<any[]> {
    const userId = this.authService.getUserId();
    if (userId == null) {
      console.error('Error: userId is null or undefined');
      return of([]);
    }

    // Datos de prueba simulados
    const testData = selectType === 'Consumo' ? [
      { devicesDetails: 'Aire Acondicionado', totalEnergy: 120.5, energyCost: 1500 },
      { devicesDetails: 'Lavadora', totalEnergy: 75.3, energyCost: 500 },
      { devicesDetails: 'Heladera', totalEnergy: 200.1, energyCost: 1800 }
    ] : [
      { devicesDetails: 'Aire Acondicionado', current: 10.5 },
      { devicesDetails: 'Lavadora', current: 5.3 },
      { devicesDetails: 'Heladera', current: 8.2 }
    ];
    return of(testData);  // Retorna datos simulados para pruebas
  }*/
}

