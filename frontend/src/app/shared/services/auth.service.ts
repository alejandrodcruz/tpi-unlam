import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';

export interface User {
  id?: number;
  username: string;
  password: string;
  email: string;
  hasDevice?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOGIN_URL = 'http://localhost:8080/auth';
  private tokenKey = 'authToken';

  private usernameSubject = new BehaviorSubject<string | null>(null);
  public username$ = this.usernameSubject.asObservable();

  constructor(private httpCliente: HttpClient, private router: Router) {
    this.usernameSubject.next(localStorage.getItem('username'));
  }

  login(username: string, password: string): Observable<any>{
    return this.httpCliente.post<any>(`${this.LOGIN_URL}/login`, { username, password }).pipe(
      tap(response => {
        if(response.token){
          console.log(response.token);
          this.setToken(response.token);
        }
      })
    )
  }

  register(user: User): Observable<any> {
    return this.httpCliente.post<any>(`${this.LOGIN_URL}/register`, user).pipe(
      tap(response => {
        console.log('User registered:', response);
      })
    );
  }

  private setToken(token: string): void{
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null{
  return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated() : boolean {
    const token = this.getToken();
    if(!token){
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp = 1000;
    return Date.now() < exp;
  }
//user en local storage
setUsername(username: string): void {
  localStorage.setItem('username', username);
  this.usernameSubject.next(username);
}

getUser(): Observable<User> {
  const username = localStorage.getItem('username')|| '';

  const mockUser: User = {
    id: 1,
    username: username,
    password: '123456',
    email: 'test@gmail.com',
    hasDevice: false,
  };

  return of(mockUser);
}

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
