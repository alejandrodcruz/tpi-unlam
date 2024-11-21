import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpService } from '../utils/httpService';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { User } from '../domain/user';
import { Device } from './user.service';

describe('UserService', () => {
  let userService: UserService;
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
        UserService,
        { provide: HttpService, useValue: httpServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  it('should call correct URL in getUserDevices', (done) => {
    const mockUserId = 1;
    const mockDevices: Device[] = [
      { deviceId: 'device1', pairingCode: '1234', assigned: true, name: 'Device 1' },
      { deviceId: 'device2', pairingCode: '5678', assigned: true, name: 'Device 2' },
    ];

    authServiceSpy.getUserId.mockReturnValue(mockUserId);
    httpServiceSpy.get.mockReturnValue(of(mockDevices));

    userService.getUserDevices().subscribe((devices) => {
      expect(devices).toEqual(mockDevices);
      expect(httpServiceSpy.get).toHaveBeenCalledWith(`devices/user/${mockUserId}`);
      done();
    });
  });


  it('should update selectedDeviceSubject when selectDevice is called', () => {
    const mockDeviceId = 'device1';

    userService.selectDevice(mockDeviceId);
    expect(userService.getSelectedDevice()).toBe(mockDeviceId);
  });

  it('should update selectedDeviceNameSubject when selectDeviceName is called', () => {
    const mockDeviceName = 'Device Name';

    userService.selectDeviceName(mockDeviceName);
    expect(userService.getSelectedDeviceName()).toBe(mockDeviceName);
  });

  it('should update userSubject in getUserData', (done) => {
    const mockUserId = 1;
    const mockUser: User = { id: 1, username: 'Juan', email: 'juan@test.com' };

    authServiceSpy.getUserId.mockReturnValue(mockUserId);
    httpServiceSpy.get.mockReturnValue(of(mockUser));

    userService.getUserData();

    userService.user$.subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(httpServiceSpy.get).toHaveBeenCalledWith(`user/${mockUserId}`);
      done();
    });
  });

});
