import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AlertsService } from './alerts.service';
import { HttpService } from '../utils/httpService';

describe('AlertsService', () => {
    let service: AlertsService;
    let httpServiceSpy: jest.Mocked<HttpService>;

    beforeEach(() => {
        const spy = {
            get: jest.fn()
        };

        TestBed.configureTestingModule({
            providers: [
                AlertsService,
                { provide: HttpService, useValue: spy }
            ]
        });

        service = TestBed.inject(AlertsService);
        httpServiceSpy = TestBed.inject(HttpService) as jest.Mocked<HttpService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call getAlertSettings and return expected data', (done) => {
        const expectedData = { alerts: [] };

        httpServiceSpy.get.mockReturnValue(of(expectedData));

        service.getAlertSettings().subscribe(data => {
            expect(data).toEqual(expectedData);
            done();
        });

        expect(httpServiceSpy.get).toHaveBeenCalledTimes(1);
        expect(httpServiceSpy.get).toHaveBeenCalledWith('alerts/get-alerts');
    });
});
