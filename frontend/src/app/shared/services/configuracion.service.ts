import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private apiUrl = 'http://localhost:8080/configuracionperfil';

  constructor(private http: HttpClient) {}

  sendProfileSelection(profile: string): Observable<any> {
    console.log("esto es lo que recibe el servicio: "+ profile);
    return this.http.post<any>(this.apiUrl, { profile });
  }

}
