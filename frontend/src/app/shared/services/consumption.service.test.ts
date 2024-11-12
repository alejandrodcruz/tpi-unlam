import { TestBed } from '@angular/core/testing';
import { ConsumptionService } from './consumption.service';
import { HttpService } from '../utils/httpService';
import { of } from 'rxjs';
import { TotalEnergyResponse } from './consumption.service';

describe('ConsumptionService', () => {
  let consumptionService: ConsumptionService;
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
        ConsumptionService,
        { provide: HttpService, useValue: httpServiceSpy },
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
    const deviceId = 'device123';

    consumptionService.getTotalKwhAndConsumption(userId, startTime, endTime, deviceId).subscribe((data) => {
      expect(data).toEqual(mockResponse);
      expect(httpServiceSpy.get).toHaveBeenCalledWith('measurements/total-energy', {
        userId: userId.toString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        deviceId: deviceId,
      }, false);
      done();
    });
  });

  it('should return last day consumption using getLastDayConsumption', (done) => {
    const mockResponse: TotalEnergyResponse = {
      totalEnergy: 200,
      energyCost: 50,
      devicesDetails: [],
    };

    httpServiceSpy.get.mockReturnValue(of(mockResponse));

    const userId = 1;
    const deviceId = 'device123';

    consumptionService.getLastDayConsumption(userId, deviceId).subscribe((energyCost) => {
      expect(energyCost).toBe(50);
      done();
    });
  });

  it('should return current month consumption using getCurrentMonthConsumption', (done) => {
    const mockResponse: TotalEnergyResponse = {
      totalEnergy: 300,
      energyCost: 75,
      devicesDetails: [],
    };

    httpServiceSpy.get.mockReturnValue(of(mockResponse));

    const userId = 1;
    const deviceId = 'device123';

    consumptionService.getCurrentMonthConsumption(userId, deviceId).subscribe((energyCost) => {
      expect(energyCost).toBe(75);
      done();
    });
  });

  it('should return previous month consumption using getPreviousMonthConsumption', (done) => {
    const mockResponse: TotalEnergyResponse = {
      totalEnergy: 400,
      energyCost: 120,
      devicesDetails: [],
    };

    httpServiceSpy.get.mockReturnValue(of(mockResponse));

    const userId = 1;
    const deviceId = 'device123';

    consumptionService.getPreviousMonthConsumption(userId, deviceId).subscribe((energyCost) => {
      expect(energyCost).toBe(120);
      done();
    });
  });

  it('should return projected current month consumption using getProjectedCurrentMonthConsumption', (done) => {
    const mockCurrentMonthResponse: number = 80;
    const mockLastDayResponse: number = 20;

    jest.spyOn(consumptionService, 'getCurrentMonthConsumption').mockReturnValue(of(mockCurrentMonthResponse));
    jest.spyOn(consumptionService, 'getLastDayConsumption').mockReturnValue(of(mockLastDayResponse));

    const userId = 1;
    const deviceId = 'device123';

    consumptionService.getProjectedCurrentMonthConsumption(userId, deviceId).subscribe((projectedCost) => {
      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const daysElapsed = today.getDate();
      const daysRemaining = daysInMonth - daysElapsed;
      const expectedProjectedCost = mockCurrentMonthResponse + (mockLastDayResponse * daysRemaining);

      expect(projectedCost).toBe(expectedProjectedCost);
      done();
    });
  });
});
