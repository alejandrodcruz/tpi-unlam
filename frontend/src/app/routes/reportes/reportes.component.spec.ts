import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReportesComponent } from './reportes.component';
import { ConsumptionService } from '../../shared/services/consumption.service';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { AddressService } from '../../shared/services/address.service';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { PanelTitleComponent } from '../panel-title/panel-title.component';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { of } from 'rxjs';

describe('ReportesComponent', () => {
  let component: ReportesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientTestingModule,
        SafeUrlPipe,
        FormsModule,
        DecimalPipe,
        PanelTitleComponent,
        ReportesComponent
      ],
      providers: [
        { provide: ConsumptionService, useValue: mockConsumptionService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: AddressService, useValue: mockAddressService },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ReportesComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.startTime).toBeInstanceOf(Date);
    expect(component.endTime).toBeInstanceOf(Date);
    expect(component.consumoTotal).toBe(0);
    expect(component.costoTotal).toBe(0);
  });

  it('should call consumptionService and calculate totals in generateReporteDatos', () => {
    // Mock data de respuesta del servicio
    const mockResponse = {
      devicesDetails: [
        { totalEnergy: 50, energyCost: 10 },
        { totalEnergy: 100, energyCost: 20 },
      ],
    };

    // Espiar el servicio y simular su respuesta
    jest.spyOn(mockConsumptionService, 'getTotalKwhAndConsumption').mockReturnValue(of(mockResponse));

    component.startTime = new Date('2023-01-01');
    component.endTime = new Date('2023-01-31');
    component.userId = 1;

    component.generateReporteDatos();

    expect(mockConsumptionService.getTotalKwhAndConsumption).toHaveBeenCalledWith(1, component.startTime, component.endTime);
    expect(component.consumoTotal).toBe(150);
    expect(component.costoTotal).toBe(30);
    expect(component.data).toEqual(mockResponse.devicesDetails);
    expect(component.errorMessage).toBeNull();
  });

});

// Mock services
const mockConsumptionService = {
  getTotalKwhAndConsumption: jest.fn().mockReturnValue(of({
    devicesDetails: [],
  })),
};

const mockAuthService = {
  getUserId: jest.fn().mockReturnValue(1),
};

const mockUserService = {
  getUserData: jest.fn(),
  selectedDevice$: of(null),
  user$: of({ username: 'test-user' }),
};

const mockAddressService = {
  getAddressesByUser: jest.fn().mockReturnValue(of([])),
};
