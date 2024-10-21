import { Injectable } from '@angular/core';
import {interval, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrenttimeService {
  constructor() {}

  getHoraActual(): Observable<Date> {

    return interval(1000).pipe(
      map(() => {

        const ahora = new Date();

        const utc = ahora.getTime() + ahora.getTimezoneOffset() * 60000;
        const argentinaTime = new Date(utc - 3 * 3600000);
        return argentinaTime;
      })
    );
  }
}
