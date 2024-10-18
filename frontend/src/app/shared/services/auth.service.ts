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

  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();//token
  private userIdSubject = new BehaviorSubject<number | null>(null);
  public userId$ = this.userIdSubject.asObservable();//observable que me permite usar el id del usuario


  constructor(private httpCliente: HttpClient, private router: Router) {
  }


  login(username: string, password: string): Observable<any>{
    return this.httpCliente.post<any>(`${this.LOGIN_URL}/login`, { username, password }).pipe(
      tap(response => {
        if(response.token){
          console.log("ESTE ES EL RESPONSE ID");
          console.log(response.id);
          this.setToken(response.token);
          this.setUserId(response.id);
          console.log("ESTE ES EL RESPONSE SUBJECT ID", this.getUserId());
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

  logout(): void {
    this.router.navigate(['/login']);
  }

  private setToken(token: string): void{
    this.tokenSubject.next(token);
  }
  getToken(): string | null{
    return this.tokenSubject.getValue();
    }
  clearToken(): void {
      this.tokenSubject.next(null); // Eliminar el token
    }

  private setUserId(id: number): void {
    this.userIdSubject.next(id);
  }
  getUserId(): number | null {
    return this.userIdSubject.getValue();// me permite usar el observable sin la necesidad de suscribirme
  }
  clearUserId(): void {
    this.userIdSubject.next(null); // Eliminar el userId
  }

 /* isAuthenticated() : boolean {
    const token = this.getToken();
    if(!token){
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp = 1000;
    return Date.now() < exp;
  }*/

}
