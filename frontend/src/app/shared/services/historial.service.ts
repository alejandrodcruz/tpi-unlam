
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  constructor() { }

  getConsumoMensual(): Observable<number[]> {
    const consumoMensual = [320, 280, 300, 350, 370, 420, 500, 450, 400, 390, 360, 340];
    return of(consumoMensual);
  }

  getConsumoDiario(): Observable<{ value: number, name: string }[]> {
    const consumoDiario = [
      { value: 15, name: '00:00-02:00' },
      { value: 12, name: '02:00-04:00' },
      { value: 8, name: '04:00-06:00' },
      { value: 10, name: '06:00-08:00' },
      { value: 18, name: '08:00-10:00' },
      { value: 25, name: '10:00-12:00' },
      { value: 35, name: '12:00-14:00' },
      { value: 30, name: '14:00-16:00' },
      { value: 28, name: '16:00-18:00' },
      { value: 20, name: '18:00-20:00' },
      { value: 22, name: '20:00-22:00' },
      { value: 15, name: '22:00-00:00' }
    ];
    return of(consumoDiario);
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
  }}


//--------------------------------------------------------
/*

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private API_URL = 'http://localhost:8080/historial';

  constructor(private http: HttpClient) { }

  getConsumoMensual(): Observable<string> {
    return this.http.get(`${this.API_URL}/consumo-mensual`);
  }

  getConsumoDiario(): Observable<string> {
    return this.http.get(`${this.API_URL}/consumo-diario`);
  }

  getIntensidadAmperaje(): Observable<string> {
    return this.http.get(`${this.API_URL}/intensidad-amperaje`);
  }

  getPotencia(): Observable<string> {
    return this.http.get(`${this.API_URL}/potencia`);
  }

  getFrecuencia(): Observable<string> {
    return this.http.get(`${this.API_URL}/frecuencia`);
  }

  getAlertasHistoricas(): Observable<{ tipo: string, descripcion: string }[]> {
    return this.http.get<{ tipo: string, descripcion: string }[]>(`${this.API_URL}/alertas-historicas`);
  }

}


 */
