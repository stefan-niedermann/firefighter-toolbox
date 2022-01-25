import { DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { ErstattungService } from './erstattung.service';

describe('ErstattungService', () => {
  let service: ErstattungService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe]
    });
    service = TestBed.inject(ErstattungService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
