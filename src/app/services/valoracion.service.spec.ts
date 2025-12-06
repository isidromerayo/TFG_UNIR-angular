import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ValoracionService } from './valoracion.service';

describe('ValoracionService', () => {
  let service: ValoracionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ValoracionService]
    });
    service = TestBed.inject(ValoracionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
