import { TestBed } from '@angular/core/testing';
import { AddressService } from './address.service';
import { HttpService } from '../utils/httpService';
import { of } from 'rxjs';
import { Address } from './address.service';

describe('AddressService', () => {
  let addressService: AddressService;
  let httpServiceSpy: jest.Mocked<HttpService>;

  beforeEach(() => {
    httpServiceSpy = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpService>;

    TestBed.configureTestingModule({
      providers: [
        AddressService,
        { provide: HttpService, useValue: httpServiceSpy },
      ],
    });

    addressService = TestBed.inject(AddressService);
  });

  it('should be created', () => {
    expect(addressService).toBeTruthy();
  });

  it('should call correct URL in getAddressesByUser', (done) => {
    const mockUserId = 1;
    const mockAddresses: Address[] = [
      { id: 1, street: '123 Main St', city: 'Anytown', country: 'Country A' },
      { id: 2, street: '456 Elm St', city: 'Othertown', country: 'Country B' },
    ];

    httpServiceSpy.get.mockReturnValue(of(mockAddresses));

    addressService.getAddressesByUser(mockUserId).subscribe((addresses) => {
      expect(addresses).toEqual(mockAddresses);
      expect(httpServiceSpy.get).toHaveBeenCalledWith(`address/user/${mockUserId}`);
      done();
    });
  });

  it('should call correct URL and body in addAddress', (done) => {
    const mockUserId = 1;
    const mockAddress: Address = { id: 3, street: '789 Pine St', city: 'Newtown', country: 'Country C' };
    const mockResponse: Address = { id: 3, street: '789 Pine St', city: 'Newtown', country: 'Country C' };

    httpServiceSpy.post.mockReturnValue(of(mockResponse));

    addressService.addAddress(mockUserId, mockAddress).subscribe((address) => {
      expect(address).toEqual(mockResponse);
      expect(httpServiceSpy.post).toHaveBeenCalledWith(mockAddress, `address/user/${mockUserId}`);
      done();
    });
  });

  it('should call correct URL and body in updateAddress', (done) => {
    const mockAddressId = 1;
    const mockAddress: Address = { id: 1, street: '123 Updated St', city: 'Updated City', country: 'Updated Country' };
    const mockResponse: Address = { id: 1, street: '123 Updated St', city: 'Updated City', country: 'Updated Country' };

    httpServiceSpy.put.mockReturnValue(of(mockResponse));

    addressService.updateAddress(mockAddressId, mockAddress).subscribe((address) => {
      expect(address).toEqual(mockResponse);
      expect(httpServiceSpy.put).toHaveBeenCalledWith(mockAddress, `address/${mockAddressId}`);
      done();
    });
  });
  it('should call correct URL in deleteAddress', (done) => {
    const mockAddressId = 1;

    httpServiceSpy.delete.mockReturnValue(of(undefined));

    addressService.deleteAddress(mockAddressId).subscribe(() => {
      expect(httpServiceSpy.delete).toHaveBeenCalledWith(`address/${mockAddressId}`);
      done();
    });
  });
});
