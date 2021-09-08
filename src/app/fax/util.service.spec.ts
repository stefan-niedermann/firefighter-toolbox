import { TestBed } from '@angular/core/testing';

import { UtilService } from './util.service';

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('serialization', () => {
    it('should strip empty properties while serializing', () => {
      expect(service.serialize({
        foo: 'bar',
        baz: '',
        qux: undefined,
        bar: null,
        xyz: [],
        abc: {}
      })).toEqual('%7B%22foo%22:%22bar%22%7D');
    });
  
    it('should strip properties which have only empty subproperties', () => {
      expect(service.serialize({
        foo: 'bar',
        baz: {
          abc: '',
          bar: null
        },
        xyz: {
          qux: []
        },
        aaa: {
          bbb: 3
        }
      })).toEqual('%7B%22foo%22:%22bar%22,%22aaa%22:%7B%22bbb%22:3%7D%7D');
    });
  });
});
