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

  describe('ensureMinimumLineCount', () => {
    it('should add blank lines when minimum is not reached', () => {
      expect(service.ensureMinimumLineCount('Hello', 4)).toEqual('Hello\n\n\n');
      expect(service.ensureMinimumLineCount('\nHello', 4)).toEqual('\nHello\n\n');
    });

    it('should not add further blank lines when minimum is already reached', () => {
      expect(service.ensureMinimumLineCount('\nHello', 1)).toEqual('\nHello');
    });
  });

  describe('breakLongLines', () => {
    it('should split long lines at the last space character if possible and remove trailing spaces', () => {
      expect(service.breakLongLines('Hello there, what\'s up?', 10)).toEqual('Hello\nthere,\nwhat\'s up?');
    });

    it('should not touch trailing spaces which are already present', () => {
      expect(service.breakLongLines('  Hello there,  what\'s up?', 10)).toEqual('  Hello\nthere, \nwhat\'s up?');
    });
    
    it('should split long lines hard if no spaces are present', () => {
      expect(service.breakLongLines('Hello', 2)).toEqual('He\nll\no');
    });
  });
});
