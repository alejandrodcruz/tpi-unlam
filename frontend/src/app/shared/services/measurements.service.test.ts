import { TestBed } from '@angular/core/testing';
import { MeasurementsService } from './measurements.service';
import { HttpService } from '../utils/httpService';
import { of } from 'rxjs';
import { Measurement } from './measurements.service';

describe('MeasurementsService', () => {
  let measurementsService: MeasurementsService;
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
        MeasurementsService,
        { provide: HttpService, useValue: httpServiceSpy },
      ],
    });

    measurementsService = TestBed.inject(MeasurementsService);
  });

  it('should be created', () => {
    expect(measurementsService).toBeTruthy();
  });

  it('should getUserMeasurements with correct params', (done) => {
    const mockMeasurements: Measurement[] = [
      { deviceId: 'device1', voltage: 120, current: 10, power: 1200, energy: 50, temperature: 25, humidity: 50, timestamp: '2024-11-01T12:00:00Z' }
    ];
    httpServiceSpy.get.mockReturnValue(of(mockMeasurements));

    const userId = 1;
    const fields = ['voltage', 'energy'];
    const timeRange = '1h';

    measurementsService.getUserMeasurements(userId, fields, timeRange).subscribe((data) => {
      expect(data).toEqual(mockMeasurements);
      expect(httpServiceSpy.get).toHaveBeenCalledWith('measurements', {
        userId: userId.toString(),
        fields: fields.join(','),
        timeRange: timeRange,
      }, false);
      done();
    });
  });

  it('should calculate total energy in getTotalEnergy', (done) => {
    const mockMeasurements: Measurement[] = [
      { deviceId: 'device1', voltage: 120, current: 10, power: 1200, energy: 50, temperature: 25, humidity: 50, timestamp: '2024-11-01T12:00:00Z' },
      { deviceId: 'device2', voltage: 220, current: 15, power: 3300, energy: 75, temperature: 30, humidity: 40, timestamp: '2024-11-01T13:00:00Z' }
    ];
    httpServiceSpy.get.mockReturnValue(of(mockMeasurements));

    const userId = 1;
    const fields = ['energy'];
    const timeRange = '1h';

    measurementsService.getTotalEnergy(userId, fields, timeRange).subscribe((totalEnergy) => {
      expect(totalEnergy).toBe(125); // 50 + 75
      expect(httpServiceSpy.get).toHaveBeenCalledWith('measurements', {
        userId: userId.toString(),
        fields: fields.join(','),
        timeRange: timeRange,
      });
      done();
    });
  });

  it('should call getUserMeasurements at intervals in getUserMeasurementsRealTime', (done) => {
    const mockMeasurements: Measurement[] = [
      { deviceId: 'device1', voltage: 120, current: 10, power: 1200, energy: 50, temperature: 25, humidity: 50, timestamp: '2024-11-01T12:00:00Z' }
    ];
    httpServiceSpy.get.mockReturnValue(of(mockMeasurements));

    const userId = 1;
    const fields = ['temperature', 'humidity'];
    const timeRange = '1h';
    const pollingInterval = 5000; // 5 segundos para la prueba

    const subscription = measurementsService.getUserMeasurementsRealTime(userId, fields, timeRange, pollingInterval).subscribe((data) => {
      expect(data).toEqual(mockMeasurements);
      expect(httpServiceSpy.get).toHaveBeenCalled();
      subscription.unsubscribe();
      done();
    });
  }, 10000);
});
