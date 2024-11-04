import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class HttpService {

  public url = environment.serverUrl;

  constructor(private http: HttpClient, private toast: ToastrService) {}

  public post<T>(body: any, controller: string): Observable<T> {
    return this.http.post<T>(`${this.url}/${controller}`, body).pipe(
      tap((res) => {}),
      catchError((error) => {
        console.log('Post error', error.message);
        this.toast.warning(error.message);
        return throwError(() => error);
      })
    );
  }

  public get<T>(controller: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    return this.http.get<T>(`${this.url}/${controller}`, { params: httpParams }).pipe(
      tap((res) => {}),
      catchError((error) => {
        console.log('Get error', error.message);
        this.toast.warning(error.message);
        return throwError(() => error);
      })
    );
  }
}
