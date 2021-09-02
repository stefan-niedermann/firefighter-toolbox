import { FaxService } from './fax.service';

describe('FaxService', () => {
  let service: FaxService;

  beforeEach(() => {
    service = new FaxService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
