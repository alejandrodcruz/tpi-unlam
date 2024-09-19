import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  constructor() { }

  // Simulación de la obtención de los datos de consumo mensual
  getConsumoMensual(): Observable<number[]> {
    const consumoMensual = [320, 280, 300, 350, 370, 420, 500, 450, 400, 390, 360, 340];
    return of(consumoMensual);
  }

  // Simulación de la obtención de los datos de consumo diario
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
}
