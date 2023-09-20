import { TestBed } from '@angular/core/testing';

import { ValoracionService } from './valoracion.service';

describe('ValoracionService', () => {
  let service: ValoracionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValoracionService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
