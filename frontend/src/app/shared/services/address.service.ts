import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../utils/httpService';

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

  private controller = 'address';

  constructor(private httpService: HttpService) { }


  getAddressesByUser(userId: number): Observable<Address[]> {
    return this.httpService.get<Address[]>(`${this.controller}/user/${userId}`);
  }

  addAddress(userId: number, address: Address): Observable<Address> {
    return this.httpService.post<Address>(address, `${this.controller}/user/${userId}`);
  }

  updateAddress(addressId: number, address: Address): Observable<Address> {
    return this.httpService.post<Address>(address, `${this.controller}/${addressId}`);
  }

  deleteAddress(addressId: number): Observable<void> {
    return this.httpService.get<void>(`${this.controller}/${addressId}`);
  }
}
