import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHistoricoComponent } from './dashboard-historico.component';
import { HttpClientModule } from '@angular/common/http';

describe('DashboardHistoricoComponent', () => {
  let component: DashboardHistoricoComponent;
  let fixture: ComponentFixture<DashboardHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardHistoricoComponent,
        HttpClientModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
