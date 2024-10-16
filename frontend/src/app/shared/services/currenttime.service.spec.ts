import { TestBed } from '@angular/core/testing';

import { CurrenttimeService } from './currenttime.service';

describe('CurrenttimeService', () => {
  let service: CurrenttimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrenttimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
