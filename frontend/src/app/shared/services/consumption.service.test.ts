import { TestBed } from '@angular/core/testing';
import { ConsumptionService } from './consumption.service';
import { HttpService } from '../utils/httpService';
import { UserService } from './user.service';
import { of } from 'rxjs';
import { TotalEnergyResponse } from './consumption.service';

describe('ConsumptionService', () => {
  let consumptionService: ConsumptionService;
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
        ConsumptionService,
        { provide: HttpService, useValue: httpServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    consumptionService = TestBed.inject(ConsumptionService);
  });

  it('should be created', () => {
    expect(consumptionService).toBeTruthy();
  });

  it('should call getTotalKwhAndConsumption', (done) => {
    const mockResponse: TotalEnergyResponse = {
      totalEnergy: 500,
      energyCost: 100,
      devicesDetails: [{ deviceId: 'device123', totalEnergy: 500, energyCost: 100, name: 'Device 1' }],
    };
    httpServiceSpy.get.mockReturnValue(of(mockResponse));

    const userId = 1;
    const startTime = new Date('2024-10-01T00:00:00Z');
    const endTime = new Date('2024-11-01T00:00:00Z');

    consumptionService.getTotalKwhAndConsumption(userId, startTime, endTime).subscribe((data) => {
      expect(data).toEqual(mockResponse);
      expect(httpServiceSpy.get).toHaveBeenCalledWith('measurements/total-energy', {
        userId: userId.toString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        deviceId: 'device123',
      });
      done();
    });
  });

  it('should return energy cost for getLastDayConsumption', (done) => {
    const mockResponse: TotalEnergyResponse = {
      totalEnergy: 100,
      energyCost: 20,
      devicesDetails: [{ deviceId: 'device123', totalEnergy: 100, energyCost: 20, name: 'Device 1' }],
    };
    httpServiceSpy.get.mockReturnValue(of(mockResponse));

    const userId = 1;
    const deviceId = 'device123';

    consumptionService.getLastDayConsumption(userId, deviceId).subscribe((energyCost) => {
      expect(energyCost).toBe(20);
      done();
    });
  });

  it('should return energy cost for getCurrentMonthConsumption', (done) => {
    const mockResponse: TotalEnergyResponse = {
      totalEnergy: 300,
      energyCost: 50,
      devicesDetails: [{ deviceId: 'device123', totalEnergy: 300, energyCost: 50, name: 'Device 1' }],
    };
    httpServiceSpy.get.mockReturnValue(of(mockResponse));

    const userId = 1;
    const deviceId = 'device123';

    consumptionService.getCurrentMonthConsumption(userId, deviceId).subscribe((energyCost) => {
      expect(energyCost).toBe(50);
      done();
    });
  });

  it('should return projected energy cost for getProjectedCurrentMonthConsumption', (done) => {
    const mockCurrentMonthResponse: TotalEnergyResponse = {
      totalEnergy: 300,
      energyCost: 60,
      devicesDetails: [{ deviceId: 'device123', totalEnergy: 300, energyCost: 60, name: 'Device 1' }],
    };
    const mockLastDayResponse: TotalEnergyResponse = {
      totalEnergy: 10,
      energyCost: 2,
      devicesDetails: [{ deviceId: 'device123', totalEnergy: 10, energyCost: 2, name: 'Device 1' }],
    };

    httpServiceSpy.get.mockReturnValueOnce(of(mockCurrentMonthResponse)).mockReturnValueOnce(of(mockLastDayResponse));

    const userId = 1;
    const deviceId = 'device123';

    consumptionService.getProjectedCurrentMonthConsumption(userId, deviceId).subscribe((projectedCost) => {
      expect(projectedCost).toBeGreaterThan(60); // Verifica que el cálculo se realice correctamente
      done();
    });
  });
});
