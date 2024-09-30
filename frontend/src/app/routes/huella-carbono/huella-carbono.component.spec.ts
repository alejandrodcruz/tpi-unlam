import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuellaCarbonoComponent } from './huella-carbono.component';

describe('HuellaCarbonoComponent', () => {
  let component: HuellaCarbonoComponent;
  let fixture: ComponentFixture<HuellaCarbonoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HuellaCarbonoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HuellaCarbonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
