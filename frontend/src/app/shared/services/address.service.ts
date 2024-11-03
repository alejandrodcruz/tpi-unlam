import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/ environment";

export interface Address {
  id: number;
  street: string;
  city: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) { }

  getAddressesByUser(userId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${environment.apiUrl}/user/${userId}`);
  }

  addAddress(userId: number, address: Address): Observable<Address> {
    return this.http.post<Address>(`${environment.apiUrl}/user/${userId}`, address);
  }

  updateAddress(addressId: number, address: Address): Observable<Address> {
    return this.http.put<Address>(`${environment.apiUrl}/${addressId}`, address);
  }

  deleteAddress(addressId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${addressId}`);
  }
}
