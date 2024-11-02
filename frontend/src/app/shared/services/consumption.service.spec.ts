import { TestBed } from '@angular/core/testing';

import { ConsumptionService } from './consumption.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('ConsumptionService', () => {
  let service: ConsumptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('ConsumptionService', () => {
    let service: ConsumptionService;
    let httpMock: HttpTestingController;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [UserService]
      });
      service = TestBed.inject(ConsumptionService);
      httpMock = TestBed.inject(HttpTestingController);
      userService = TestBed.inject(UserService);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should get total kWh and consumption', () => {
      const mockResponse = {
        totalEnergy: 100,
        energyCost: 50,
        devicesDetails: []
      };

      service.getTotalKwhAndConsumption(1, new Date('2023-01-01'), new Date('2023-01-31')).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/total-energy?userId=1&startTime=2023-01-01T00:00:00.000Z&endTime=2023-01-31T00:00:00.000Z`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should get last day consumption', () => {
      const mockResponse = {
        totalEnergy: 100,
        energyCost: 50,
        devicesDetails: []
      };

      service.getLastDayConsumption(1, 'device1').subscribe(response => {
        expect(response).toBe(50);
      });

      const req = httpMock.expectOne(req => req.url.includes(`${service['apiUrl']}/total-energy`));
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should get current month consumption', () => {
      const mockResponse = {
        totalEnergy: 100,
        energyCost: 50,
        devicesDetails: []
      };

      service.getCurrentMonthConsumption(1, 'device1').subscribe(response => {
        expect(response).toBe(50);
      });

      const req = httpMock.expectOne(req => req.url.includes(`${service['apiUrl']}/total-energy`));
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should get previous month consumption', () => {
      const mockResponse = {
        totalEnergy: 100,
        energyCost: 50,
        devicesDetails: []
      };

      service.getPreviousMonthConsumption(1, 'device1').subscribe(response => {
        expect(response).toBe(50);
      });

      const req = httpMock.expectOne(req => req.url.includes(`${service['apiUrl']}/total-energy`));
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should get projected current month consumption', () => {
      const mockResponse = {
        totalEnergy: 100,
        energyCost: 50,
        devicesDetails: []
      };

      service.getProjectedCurrentMonthConsumption(1, 'device1').subscribe(response => {
        expect(response).toBeGreaterThan(0);
      });

      const req = httpMock.expectOne(req => req.url.includes(`${service['apiUrl']}/total-energy`));
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
