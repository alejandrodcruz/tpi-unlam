import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.prod';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private authService!: AuthService;
  public url = environment.serverUrl;

  constructor(private http: HttpClient, private toast: ToastrService, private injector: Injector) {
  setTimeout(() => {
    this.authService = this.injector.get(AuthService);
  });
}
  private createHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  public post<T>(body: any, controller: string): Observable<T> {
    return this.http.post<T>(`${this.url}/${controller}`, body).pipe(
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
        if (Array.isArray(params[key])) {
          params[key].forEach((value: string) => {
            httpParams = httpParams.append(key, value);
          });
        } else {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }
    return this.http.get<T>(`${this.url}/${controller}`, { params: httpParams }).pipe(
      catchError((error) => {
        console.log('Get error', error.message);
        this.toast.warning(error.message);
        return throwError(() => error);
      })
    );
  }

  public put<T>(body: any, controller: string): Observable<T> {
    const headers = this.createHeaders();
    return this.http.put<T>(`${this.url}/${controller}`, body, { headers }).pipe(
      catchError((error) => {
        console.log('Put error', error.message);
        this.toast.warning(error.message);
        return throwError(() => error);
      })
    );
  }

  public delete<T>(controller: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    return this.http.delete<T>(`${this.url}/${controller}`, { params: httpParams }).pipe(
      catchError((error) => {
        console.log('Delete error', error.message);
        this.toast.warning(error.message);
        return throwError(() => error);
      })
    );
  }

}
