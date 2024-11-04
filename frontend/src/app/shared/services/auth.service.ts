import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { HttpService } from '../utils/httpService';

export interface User {
  id?: number;
  username: string;
  password: string;
  email: string;
  hasDevice?: boolean;
  street?: string;
  city?: string;
  country?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOGIN_URL = 'http://localhost:8080/auth';

  private tokenSubject = new BehaviorSubject<string | null>(this.getTokenFromStorage());
  public token$ = this.tokenSubject.asObservable();
  private userIdSubject = new BehaviorSubject<number | null>(this.getUserIdFromStorage());
  public userId$ = this.userIdSubject.asObservable();

  constructor(private httpCliente: HttpClient, private router: Router, private httpService: HttpService) {}

  login(username: string, password: string): Observable<any> {
    return this.httpService.post<any>({ username, password }, 'auth/login').pipe(
      tap((response) => {
        if (response && response.token) {
          this.setToken(response.token);
          this.setUserId(response.id);

        }
      })
    );
  }

  register(user: User): Observable<any> {
    return this.httpService.post<any>( user, 'auth/register').pipe(
      tap(response => {
        console.log('User registered:', response);
      })
    );
  }

  logout(): void {
    this.clearToken();
    this.clearUserId();
    this.router.navigate(['/login']);
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return this.tokenSubject.getValue() || this.getTokenFromStorage();
  }

  private getTokenFromStorage(): string | null {
    return localStorage.getItem('token');
  }

  clearToken(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  private setUserId(id: number): void {
    localStorage.setItem('userId', id.toString());
    this.userIdSubject.next(id);
  }

  getUserId(): number | null {
    return this.userIdSubject.getValue() || this.getUserIdFromStorage();
  }

  private getUserIdFromStorage(): number | null {
    const storedId = localStorage.getItem('userId');
    return storedId ? Number(storedId) : null;
  }

  clearUserId(): void {
    localStorage.removeItem('userId');
    this.userIdSubject.next(null);
  }
}
