import { of } from 'rxjs';
import { FaxService } from './fax.service';
import { NominatimService } from './nominatim.service';
import { UtilService } from './util.service';

describe('FaxService', () => {
  let service: FaxService;

  beforeEach(() => {
    service = new FaxService(
      new UtilService(),
      {
        getCoordinates: () => of({ x: '', y: '' })
      } as unknown as NominatimService
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
