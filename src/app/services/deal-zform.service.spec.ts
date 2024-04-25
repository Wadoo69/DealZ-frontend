import { TestBed } from '@angular/core/testing';

import { DealZFormService } from './deal-zform.service';

describe('DealZFormService', () => {
  let service: DealZFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealZFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
