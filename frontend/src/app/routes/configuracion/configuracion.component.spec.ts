/*import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguracionComponent } from './configuracion.component';
import { ConfiguracionService } from '../../shared/services/configuracion.service';
import { of, throwError } from 'rxjs';

describe('ConfiguracionComponent', () => {
  let component: ConfiguracionComponent;
  let fixture: ComponentFixture<ConfiguracionComponent>;
  let configuracionServiceSpy: jasmine.SpyObj<ConfiguracionService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ConfiguracionService', ['getStoredProfile', 'sendProfileSelection']);

    await TestBed.configureTestingModule({
      imports: [ConfiguracionComponent], // Ya que es un componente standalone
      providers: [
        {provide: ConfiguracionService, useValue: spy}
      ]
    }).compileComponents();

    configuracionServiceSpy = TestBed.inject(ConfiguracionService) as jasmine.SpyObj<ConfiguracionService>;
    fixture = TestBed.createComponent(ConfiguracionComponent);
    component = fixture.componentInstance;
  });


  it('should initialize selectedProfile on ngOnInit', () => {
    const profileData = { profile: 'testProfile' };
    configuracionServiceSpy.getStoredProfile.and.returnValue(of(profileData));

    component.ngOnInit();

    expect(component.selectedProfile).toEqual(profileData.profile);
    expect(configuracionServiceSpy.getStoredProfile).toHaveBeenCalled();
  });

  it('should handle error when ngOnInit fails to fetch profile', () => {
    const errorResponse = new Error('Error al obtener el perfil');
    configuracionServiceSpy.getStoredProfile.and.returnValue(throwError(errorResponse));

    spyOn(console, 'error'); // Espía la consola para ver si se imprime el error

    component.ngOnInit();

    expect(console.error).toHaveBeenCalled('Error al obtener el perfil almacenado');
  });

})*/
