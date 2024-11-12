

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private API_URL = 'http://localhost:8080/historial';

  constructor(private http: HttpClient) { }

  getConsumoMensual(): Observable<string> {
      return of('assets/img/consumomensual.png');

    //return this.http.get<string>(`${this.API_URL}/consumo-mensual`);
  }

  getConsumoDiario(): Observable<string> {
    return of('assets/img/consumo-franjas.png');
    //return this.http.get<string>(`${this.API_URL}/consumo-diario`);
  }

  getIntensidadAmperaje(): Observable<string> {
    return this.http.get<string>(`${this.API_URL}/intensidad-amperaje`);
  }

  getPotencia(): Observable<string> {
    return this.http.get<string>(`${this.API_URL}/potencia`);
  }

  getFrecuencia(): Observable<string> {
    return this.http.get<string>(`${this.API_URL}/frecuencia`);
  }

  getAlertasHistoricas(): Observable<{ tipo: string, descripcion: string }[]> {
    const alertas = [
      {tipo: 'corte', descripcion: 'Corte de energía registrado el 12/09/2024 a las 14:00'},
      {tipo: 'dispositivo', descripcion: 'Nuevo dispositivo agregado el 05/08/2024: Aire Acondicionado'},
      {tipo: 'corte', descripcion: 'Corte de energía registrado el 22/07/2024 a las 10:30'},
      {tipo: 'dispositivo', descripcion: 'Nuevo dispositivo agregado el 18/06/2024: Lámpara LED'},
      {tipo: 'dispositivo', descripcion: 'Nuevo dispositivo agregado el 11/06/2024: Microondas'}
    ];
    return of(alertas);
    //return this.http.get<{ tipo: string, descripcion: string }[]>(`${this.API_URL}/alertas-historicas`);
  }

}
