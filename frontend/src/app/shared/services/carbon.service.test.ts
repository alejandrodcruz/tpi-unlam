import { TestBed } from '@angular/core/testing';
import { CarbonService } from './carbon.service';
import { HttpService } from '../utils/httpService';
import { UserService } from './user.service';
import { of } from 'rxjs';
import { TotalEnergy } from '../../routes/carbon-footprint/models/totalEnergy.models';

describe('CarbonService', () => {
  let carbonService: CarbonService;
  let httpServiceSpy: jest.Mocked<HttpService>;
  let userServiceSpy: jest.Mocked<UserService>;

  beforeEach(() => {
    // Crear mocks de las dependencias
    httpServiceSpy = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpService>;

    userServiceSpy = {
      selectedDevice$: of('device123'),
    } as unknown as jest.Mocked<UserService>;

    // Configurar el módulo de prueba
    TestBed.configureTestingModule({
      providers: [
        CarbonService,
        { provide: HttpService, useValue: httpServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    carbonService = TestBed.inject(CarbonService);
  });

  it('should be created', () => {
    expect(carbonService).toBeTruthy();
  });

  it('should call getTotalKwh ', (done) => {
    const mockResponse = { totalEnergy: 100, energyCost: 50 };
    httpServiceSpy.get.mockReturnValue(of(mockResponse));

    const userId = 1;
    const startTime = new Date('2024-10-01T00:00:00Z');
    const endTime = new Date('2024-11-01T00:00:00Z');

    carbonService.getTotalKwh(userId, startTime, endTime).subscribe((data) => {
      expect(data).toEqual(mockResponse);
      expect(httpServiceSpy.get).toHaveBeenCalledWith('measurements/total-energy', {
        userId: userId.toString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      }, false);
      done();
    });
  });

  it('should poll for data when getTotalKwhRealTime is called', (done) => {
    const mockResponse = { totalEnergy: 150, energyCost: 75 };
    httpServiceSpy.get.mockReturnValue(of(mockResponse));

    const userId = 1;
    const startTime = new Date('2024-10-01T00:00:00Z');

    const subscription = carbonService.getTotalKwhRealTime(userId, startTime).subscribe((data) => {
      expect(data).toEqual(mockResponse);
      expect(httpServiceSpy.get).toHaveBeenCalled();
      subscription.unsubscribe();
      done();
    });
  }, 15000);
});
