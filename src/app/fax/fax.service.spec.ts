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

  describe('serialization', () => {
    it('should strip empty properties while serializing', () => {
      expect(service.serialize({
        mitteiler: 'bar',
        patient: '',
        bemerkung: undefined
      })).toEqual('%7B%22v%22:1,%22payload%22:%7B%22mitteiler%22:%22bar%22%7D%7D');

      expect(service.serialize({
        einsatzmittel: null,
        patient: [],
        bemerkung: {}
      })).toEqual('%7B%22v%22:1%7D');
    });
  
    it('should strip properties which have only empty subproperties', () => {
      expect(service.serialize({
        mitteiler: 'bar',
        einsatzgrund: {
          schlagwort: '',
          stichwort: null
        },
        einsatzmittel: [],
        bemerkung: undefined
      })).toEqual('%7B%22v%22:1,%22payload%22:%7B%22mitteiler%22:%22bar%22%7D%7D');
    });
  });
});
