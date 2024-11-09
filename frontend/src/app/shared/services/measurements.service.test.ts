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

  it('should call HttpService.get with correct params in getUserMeasurements', (done) => {
    const mockUserId = 1;
    const mockFields = ['voltage', 'current'];
    const mockTimeRange = '1h';
    const mockMeasurements: Measurement[] = [
      { deviceId: 'device1', voltage: 120, current: 10, power: 1000, energy: 500, temperature: 25, humidity: 50, timestamp: '2024-11-01T12:00:00Z' }
    ];

    httpServiceSpy.get.mockReturnValue(of(mockMeasurements));

    measurementsService.getUserMeasurements(1, mockFields, mockTimeRange).subscribe((measurements) => {
      expect(measurements).toEqual(mockMeasurements);
      expect(httpServiceSpy.get).toHaveBeenCalledWith('measurements', {
        userId: mockUserId.toString(),
        fields: mockFields.join(','),
        timeRange: mockTimeRange,
      });
      done();
    });
  });

  it('should call HttpService.get and calculate total energy in getTotalEnergy', (done) => {
    const mockUserId = 1;
    const mockFields = ['energy'];
    const mockTimeRange = '1h';
    const mockMeasurements: Measurement[] = [
      { deviceId: 'device1', voltage: 120, current: 10, power: 1000, energy: 500, temperature: 25, humidity: 50, timestamp: '2024-11-01T12:00:00Z' },
      { deviceId: 'device2', voltage: 220, current: 15, power: 1500, energy: 700, temperature: 27, humidity: 55, timestamp: '2024-11-01T13:00:00Z' }
    ];

    httpServiceSpy.get.mockReturnValue(of(mockMeasurements));

    measurementsService.getTotalEnergy(mockUserId, mockFields, mockTimeRange).subscribe((totalEnergy) => {
      expect(totalEnergy).toBe(1200); // 500 + 700
      expect(httpServiceSpy.get).toHaveBeenCalledWith('measurements', {
        userId: mockUserId.toString(),
        fields: mockFields.join(','),
        timeRange: mockTimeRange,
      });
      done();
    });
  });

  it('should call HttpService.get at intervals in getUserMeasurementsRealTime', (done) => {
    const mockUserId = 1;
    const mockFields = ['voltage', 'current'];
    const mockTimeRange = '1h';
    const mockPollingInterval = 1000; // Reduce el intervalo para pruebas rápidas
    const mockMeasurements: Measurement[] = [
      { deviceId: 'device1', voltage: 120, current: 10, power: 1000, energy: 500, temperature: 25, humidity: 50, timestamp: '2024-11-01T12:00:00Z' }
    ];

    httpServiceSpy.get.mockReturnValue(of(mockMeasurements));

    const subscription = measurementsService.getUserMeasurementsRealTime(mockUserId, mockFields, mockTimeRange, mockPollingInterval).subscribe((measurements) => {
      expect(measurements).toEqual(mockMeasurements);
      expect(httpServiceSpy.get).toHaveBeenCalled();
      subscription.unsubscribe();
      done();
    });
  });
});
