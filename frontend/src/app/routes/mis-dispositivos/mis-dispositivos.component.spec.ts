import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisDispositivosComponent } from './mis-dispositivos.component';

describe('MisDispositivosComponent', () => {
  let component: MisDispositivosComponent;
  let fixture: ComponentFixture<MisDispositivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisDispositivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisDispositivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
