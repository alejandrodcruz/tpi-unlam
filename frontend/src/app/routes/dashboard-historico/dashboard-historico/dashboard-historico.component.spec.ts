import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHistoricoComponent } from './dashboard-historico.component';
import { HistorialService } from "../../../shared/services/historial.service";
import { of, throwError } from "rxjs";



describe('DashboardHistoricoComponent', () => {
  let component: DashboardHistoricoComponent;
  let fixture: ComponentFixture<DashboardHistoricoComponent>;
  let mockHistorialService: jasmine.SpyObj<HistorialService>;

  beforeEach(async () => {
    // Crear un mock de HistorialService
    mockHistorialService = jasmine.createSpyObj('HistorialService', ['getConsumoMensual']);

    await TestBed.configureTestingModule({
      declarations: [DashboardHistoricoComponent],
      providers: [
        {provide: HistorialService, useValue: mockHistorialService} // Usamos el mock
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHistoricoComponent);
    component = fixture.componentInstance;
  });

  it('should call loadConsumoMensual and set consumoMensual correctly', () => {
    const mockConsumoMensual = [100, 150, 200];

    // mock
    mockHistorialService.getConsumoMensual.and.returnValue(of(mockConsumoMensual));

    component.loadConsumoMensual();


    expect(component.consumoMensual).equal(mockConsumoMensual);
    //expect(mockHistorialService.getConsumoMensual).toHaveBeenCalled();
  });

  it('should handle error when loadConsumoMensual fails', () => {
    const mockError = new Error('Error fetching consumo mensual');

    // Configurar el mock para devolver un error
    mockHistorialService.getConsumoMensual.and.returnValue(throwError(() => mockError));

    spyOn(console, 'error');

    component.loadConsumoMensual();


    //expect(console.error).toHaveBeenCalledWith('Error fetching consumo mensual:', mockError);
    expect(component.consumoMensual.length).equal(0); // Verificamos que no haya datos
  });


  it('should create', () => {
    expect(!!component).equal(true);
  });
});


