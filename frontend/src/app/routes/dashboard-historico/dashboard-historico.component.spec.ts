

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHistoricoComponent } from './dashboard-historico.component';
import { HistorialService } from "../../shared/services/historial.service";
import { UserService } from '../../shared/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('DashboardHistoricoComponent', () => {
  let component: DashboardHistoricoComponent;
  let fixture: ComponentFixture<DashboardHistoricoComponent>;
  let mockHistorialService: jest.Mocked<HistorialService>;
  let mockUserService: jest.Mocked<UserService>;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    mockHistorialService = {
    } as jest.Mocked<HistorialService>;

    mockUserService = {
      selectedDevice$: of('device123')
    } as jest.Mocked<UserService>;

    await TestBed.configureTestingModule({
      imports: [DashboardHistoricoComponent],
      providers: [
        { provide: HistorialService, useValue: mockHistorialService },
        { provide: UserService, useValue: mockUserService },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustResourceUrl: jest.fn(url => url) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHistoricoComponent);
    component = fixture.componentInstance;
    sanitizer = TestBed.inject(DomSanitizer);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('debería suscribirse a selectedDevice y llamar a updateIframeUrl con el dispositivo seleccionado', () => {
    const updateIframeUrlSpy = jest.spyOn(component, 'updateIframeUrl');
    component.ngOnInit();
    expect(component.selectedDevice).toBe('device123');
    expect(updateIframeUrlSpy).toHaveBeenCalled();
  });

  it('debería actualizar las URLs seguras al llamar a updateIframeUrl con un dispositivo seleccionado', () => {
    component.selectedDevice = 'device123';
    component.updateIframeUrl();

    const powerUrl = 'http://localhost:3000/d-solo/ee1me0bqeal8gf/power-last-year?orgId=1&panelId=1&var-deviceId=device123&refresh=5s';
    const voltageUrl = 'http://localhost:3000/d-solo/ae1mdiw2xsb28c/voltage-last-year?orgId=1&panelId=1&var-deviceId=device123&refresh=5s';
    const histEnergyMonthUrl = 'http://localhost:3000/d-solo/fe1mcple571fkf/hist-energy-month?orgId=1&panelId=1&var-deviceId=device123&refresh=5s';
    const histEnergyUrl = 'http://localhost:3000/d-solo/ae1m3p3ni09vke/hist-energy?orgId=1&panelId=1&var-deviceId=device123&refresh=5s';

    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(powerUrl);
    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(voltageUrl);
    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(histEnergyMonthUrl);
    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(histEnergyUrl);

    expect(component.powerLastYearUrl).toBe(powerUrl);
    expect(component.voltageLastYearUrl).toBe(voltageUrl);
    expect(component.histEnergyMonthUrl).toBe(histEnergyMonthUrl);
    expect(component.histEnergyUrl).toBe(histEnergyUrl);
  });
});
