import { TestBed } from '@angular/core/testing';
import { DeviceService, DeviceUser } from './device.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

class MockAuthService {
  getUserId(): number | null {
    return 1;
  }

  getToken(): string | null {
    return 'mock-token';
  }
}

describe('DeviceService', () => {
  let service: DeviceService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DeviceService,
        { provide: AuthService, useClass: MockAuthService }
      ]
    });

    service = TestBed.inject(DeviceService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  describe('getUserDevices', () => {
    it('should fetch user devices successfully', () => {
      const mockDevices: DeviceUser[] = [
        { deviceId: 1, pairingCode: 'ABC123', assigned: true },
        { deviceId: 2, pairingCode: 'DEF456', assigned: true }
      ];

      service.getUserDevices().subscribe(devices => {
        expect(devices).toEqual(mockDevices);
      });

      const req = httpMock.expectOne('http://lytics.dyndns.org:8080/api/devices/user/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockDevices); // Simula la respuesta con los dispositivos mock
    });

    it('should throw an error if userId is not found', () => {
      spyOn(authService, 'getUserId').and.returnValue(null);

      expect(() => service.getUserDevices()).toThrowError('No se ha encontrado el userId');
    });

    it('should handle HTTP error when fetching user devices', () => {
      const errorMessage = 'Simulated network error';

      service.getUserDevices().subscribe(
        () => fail('Debería haber fallado con un error 500'),
        (error) => {
          expect(error.status).toEqual(500);
        }
      );

      const req = httpMock.expectOne('http://lytics.dyndns.org:8080/api/devices/user/1');
      expect(req.request.method).toBe('GET');
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('pairDevice', () => {
    it('should pair device successfully', () => {
      const pairingCode = 'ABC123';
      const successMessage = 'Dispositivo asociado al usuario.';

      service.pairDevice(pairingCode).subscribe(response => {
        expect(response).toEqual(successMessage);
      });

      const req = httpMock.expectOne('http://lytics.dyndns.org:8080/api/pair-device');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        pairingCode: pairingCode,
        userId: 1
      });
      req.flush(successMessage); // Simula una respuesta exitosa
    });

    it('should throw an error if userId is not found when pairing device', () => {
      spyOn(authService, 'getUserId').and.returnValue(null);

      expect(() => service.pairDevice('ABC123')).toThrowError('No se ha encontrado el userId');
    });

    it('should handle HTTP error when pairing device', () => {
      const pairingCode = 'ABC123';
      const errorMessage = 'Código de emparejamiento inválido o ya utilizado.';

      service.pairDevice(pairingCode).subscribe(
        () => fail('Debería haber fallado con un error 400'),
        (error) => {
          expect(error).toEqual(errorMessage);
        }
      );

      const req = httpMock.expectOne('http://lytics.dyndns.org:8080/api/pair-device');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        pairingCode: pairingCode,
        userId: 1
      });
      req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
    });
  });
});

