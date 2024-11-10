import { TestBed } from '@angular/core/testing';
import { DeviceService } from './device.service';
import { HttpService } from '../utils/httpService';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { DeviceUser } from './device.service';

describe('DeviceService', () => {
  let deviceService: DeviceService;
  let httpServiceSpy: jest.Mocked<HttpService>;
  let authServiceSpy: jest.Mocked<AuthService>;

  beforeEach(() => {
    httpServiceSpy = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpService>;

    authServiceSpy = {
      getUserId: jest.fn(),
      getToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    TestBed.configureTestingModule({
      providers: [
        DeviceService,
        { provide: HttpService, useValue: httpServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    deviceService = TestBed.inject(DeviceService);
  });

  it('should be created', () => {
    expect(deviceService).toBeTruthy();
  });

  it('should get the  devices$ when getUserDevices is called', (done) => {
    const mockUserId = 1;
    const mockDevices: DeviceUser[] = [
      { deviceId: 'device1', pairingCode: '1234', assigned: true, name: 'Device 1' },
      { deviceId: 'device2', pairingCode: '5678', assigned: true, name: 'Device 2' },
    ];

    authServiceSpy.getUserId.mockReturnValue(mockUserId);
    httpServiceSpy.get.mockReturnValue(of(mockDevices));

    deviceService.getUserDevices().subscribe((devices) => {
      expect(devices).toEqual(mockDevices);
      expect(httpServiceSpy.get).toHaveBeenCalledWith(`devices/user/${1}`);
      done();
    });
  });

  it('should call pairDevice', (done) => {
    const mockUserId = 1;
    const mockResponse = { success: true };
    const pairingCode = '1234';
    const nameDevice = 'New Device';
    const addressId = 123;

    authServiceSpy.getUserId.mockReturnValue(mockUserId);
    httpServiceSpy.post.mockReturnValue(of(mockResponse));

    deviceService.pairDevice(pairingCode, nameDevice, addressId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(httpServiceSpy.post).toHaveBeenCalledWith(
        {
          pairingCode: pairingCode,
          userId: mockUserId,
          name: nameDevice,
          addressId: addressId,
        },
        'devices/pair-device'
      );
      done();
    });
  });

  it('should call updateDevice', (done) => {
    const mockDeviceId = 'device1';
    const mockName = 'Updated Device';
    const mockDevice: DeviceUser = { deviceId: 'device1', pairingCode: '1234', assigned: true, name: 'Updated Device' };

    httpServiceSpy.put.mockReturnValue(of(mockDevice));

    deviceService.updateDevice(mockDeviceId, mockName).subscribe((device) => {
      expect(device).toEqual(mockDevice);
      expect(httpServiceSpy.put).toHaveBeenCalledWith(
        { name: mockName },
        `devices/${mockDeviceId}`
      );
      done();
    });
  });

  it('should delete and update devices$ when deleteDevice is called', (done) => {
    const mockDeviceId = 'device1';
    const mockDevices: DeviceUser[] = [
      { deviceId: 'device1', pairingCode: '1234', assigned: true, name: 'Device 1' },
      { deviceId: 'device2', pairingCode: '5678', assigned: true, name: 'Device 2' },
    ];

    httpServiceSpy.delete.mockReturnValue(of({}));
    deviceService['devicesSubject'].next(mockDevices);

    deviceService.deleteDevice(mockDeviceId).subscribe(() => {
      expect(httpServiceSpy.delete).toHaveBeenCalledWith(`devices/${mockDeviceId}`);
      expect(deviceService['devicesSubject'].value).toEqual([
        { deviceId: 'device2', pairingCode: '5678', assigned: true, name: 'Device 2' },
      ]);
      done();
    });
  });
});
