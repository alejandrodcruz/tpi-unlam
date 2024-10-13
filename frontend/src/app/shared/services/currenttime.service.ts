import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrenttimeService {
  private apiUrl = 'http://worldtimeapi.org/api/timezone/America/Argentina/Buenos_Aires';

  constructor(private http: HttpClient) { }

  getHoraActual(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
