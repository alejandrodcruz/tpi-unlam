import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HistorialService } from './historial.service';

describe('HistorialService', () => {
  let service: HistorialService;

  beforeEach(() => {
    // Configura el entorno de pruebas para inyectar el servicio
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HistorialService]
    });
    service = TestBed.inject(HistorialService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
