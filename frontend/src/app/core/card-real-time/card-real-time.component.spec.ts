import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRealTimeComponent } from './card-real-time.component';

describe('CardRealTimeComponent', () => {
  let component: CardRealTimeComponent;
  let fixture: ComponentFixture<CardRealTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRealTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
