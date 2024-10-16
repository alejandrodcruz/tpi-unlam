import { Injectable } from '@angular/core';
import {interval, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrenttimeService {
  constructor() { }

  getHoraActual(): Observable<string> {
    return interval(1000).pipe(
      map(() => {
        const now = new Date();
        return this.formatearHora(now);
      })
    );
  }

  // Método para formatear la hora en formato HH:mm:ss
  private formatearHora(date: Date): string {
    const horas = this.agregarCero(date.getHours());
    const minutos = this.agregarCero(date.getMinutes());
    const segundos = this.agregarCero(date.getSeconds());
    return `${horas}:${minutos}:${segundos}`;
  }

  // Agregar un cero adelante si el valor es menor a 10
  private agregarCero(valor: number): string {
    return valor < 10 ? '0' + valor : valor.toString();
  }
}
