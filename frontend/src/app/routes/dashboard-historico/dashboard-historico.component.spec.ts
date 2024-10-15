import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHistoricoComponent } from './dashboard-historico.component';
import { HistorialService } from "../../shared/services/historial.service";
import { of, throwError } from "rxjs";



describe('DashboardHistoricoComponent', () => {
  let component: DashboardHistoricoComponent;
  let fixture: ComponentFixture<DashboardHistoricoComponent>;
  let mockHistorialService: jasmine.SpyObj<HistorialService>;

  beforeEach(async () => {
    // Crear un mock de HistorialService => getConsumoMensual
    mockHistorialService = jasmine.createSpyObj('HistorialService', ['getConsumoMensual']);

    // Crea un mock de HistorialService => getConsumoDiario
    mockHistorialService = jasmine.createSpyObj('HistorialService', ['getConsumoDiario']);


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

  it('el componente deberia crearse', () => {
    expect(component).equal(true);
  });


  it('deberia llamar a loadConsumoMensual y setear consumoMensual ', () => {

    // --------------- preparacion   ----------------------
    const mockConsumoMensual = 'http://localhost:8080/historial';


    // ---------------- ejecucion  ----------------------------
    // mock al servicio  para compararlo con el componente
    mockHistorialService.getConsumoMensual.and.returnValue(of(mockConsumoMensual));

    // el componente cuando se ejecuta llama al servicio  mockHistorialService.getConsumoMensual
    component.cargarConsumoMensual();


    // ---------------- verificacion  --------------------------
  // compara los resultados
    expect(component.consumoMensual).equal(mockConsumoMensual);
    //expect(mockHistorialService.getConsumoMensual).toHaveBeenCalled();
  });



  it('deberia mostrar un error cuando loadConsumoMensual falla', () => {

    // --------------- preparacion   ----------------------
    const mockError = new Error('Error fetching consumo mensual');

    // ---------------- ejecucion  ----------------------------
    // Configurar el mock para devolver un error
    mockHistorialService.getConsumoMensual.and.returnValue(throwError(() => mockError));

    spyOn(console, 'error');

    component.cargarConsumoMensual();

    // ---------------- verificacion  --------------------------
    expect(component.consumoMensual.length).equal(0); // Verificamos que no haya datos
  });



  it('deberia llamar a loadConsumoDiario y setear consumoDiario', ()=>{

    // --------------- preparacion   ----------------------
    const mockConsumoDiario =
      'http://localhost:8080/historial';

    // ---------------- ejecucion  ----------------------------
    mockHistorialService.getConsumoDiario.and.returnValue(of(mockConsumoDiario));
    component.cargarConsumoDiario();

    // ---------------- verificacion  --------------------------
    expect(component.consumoDiario).equal(mockConsumoDiario);
  });


  it('deberia mostrar un error cuando loadConsumoDiario falla', () => {

    // --------------- preparacion   ----------------------
    const mockError = new Error('Error fetching consumo diario');

    // ---------------- ejecucion  ----------------------------
    // Configurar el mock para devolver un error
    mockHistorialService.getConsumoDiario.and.returnValue(throwError(() => mockError));

    spyOn(console, 'error');

    component.cargarConsumoDiario();

    // ---------------- verificacion  --------------------------
    expect(component.consumoDiario.length).equal(0); // Verificamos que no haya datos
  });


  it('deberia llamar a loadAlertasHistoricas y setear alertasHistoricas', ()=>{

    // --------------- preparacion   ----------------------
    const mockAlertasHistoricas = [
      {tipo: 'corte', descripcion: 'Corte de energía registrado el 12/09/2024 a las 14:00'},
      {tipo: 'dispositivo', descripcion: 'Nuevo dispositivo agregado el 05/08/2024: Aire Acondicionado'},
      {tipo: 'corte', descripcion: 'Corte de energía registrado el 22/07/2024 a las 10:30'}]

    // ---------------- ejecucion  ----------------------------
    mockHistorialService.getAlertasHistoricas.and.returnValue(of(mockAlertasHistoricas));
    component.loadAlertasHistoricas();

    // ---------------- verificacion  --------------------------
    expect(component.alertasHistoricas).equal(mockAlertasHistoricas);
  });

  it('deberia mostrar un error cuando loadAlertasHistoricas falla', () => {

    // --------------- preparacion   ----------------------
    const mockError = new Error('Error fetching alertas Historicas');

    // ---------------- ejecucion  ----------------------------
    // Configurar el mock para devolver un error
    mockHistorialService.getAlertasHistoricas.and.returnValue(throwError(() => mockError));

    spyOn(console, 'error');

    component.loadAlertasHistoricas();

    // ---------------- verificacion  --------------------------
    expect(component.alertasHistoricas.length).equal(0); // Verificamos que no haya datos
  });
});


