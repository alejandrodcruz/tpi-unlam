import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://lytics.dyndns.org:8080/address';

  constructor(private http: HttpClient) { }

  getAddressesByUser(userId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/user/${userId}`);
  }

  addAddress(userId: number, address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.apiUrl}/user/${userId}`, address);
  }

  updateAddress(addressId: number, address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/${addressId}`, address);
  }

  deleteAddress(addressId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${addressId}`);
  }
}
