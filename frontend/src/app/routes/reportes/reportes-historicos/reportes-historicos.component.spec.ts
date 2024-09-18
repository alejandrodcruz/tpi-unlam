import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesHistoricosComponent } from './reportes-historicos.component';

describe('ReportesHistoricosComponent', () => {
  let component: ReportesHistoricosComponent;
  let fixture: ComponentFixture<ReportesHistoricosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesHistoricosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesHistoricosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
