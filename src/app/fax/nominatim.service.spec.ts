import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { NominatimService } from './nominatim.service';

describe('NominatimService', () => {
  let service: NominatimService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(NominatimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
