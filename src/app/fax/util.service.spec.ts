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
