import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  id: number;
  name: string;
  hasDevice: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getUser(): Observable<User> {

    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      hasDevice: false,
    };

    return of(mockUser);
  }
}
