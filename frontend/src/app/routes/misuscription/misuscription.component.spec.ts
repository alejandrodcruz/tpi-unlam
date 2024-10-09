import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisuscriptionComponent } from './misuscription.component';

describe('MisuscriptionComponent', () => {
  let component: MisuscriptionComponent;
  let fixture: ComponentFixture<MisuscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisuscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisuscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
