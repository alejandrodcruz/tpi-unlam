import { Injectable } from '@angular/core';
import {interval, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrenttimeService {
  constructor() { }

  getHoraActual(): Observable<string> {
    return interval(30000).pipe( // 60000 ms = 1 minuto
      map(() => {
        const now = new Date();
        return this.formatearHora(now);
      })
    );
  }


  private formatearHora(date: Date): string {
    const horas = this.agregarCero(date.getHours());
    const minutos = this.agregarCero(date.getMinutes());
    return `${horas}:${minutos}`;
  }

  // Agregar un cero adelante si el valor es menor a 10
  private agregarCero(valor: number): string {
    return valor < 10 ? '0' + valor : valor.toString();
  }
}
