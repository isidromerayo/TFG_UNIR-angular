import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { ValoracionComponent } from './valoracion.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ValoracionService } from 'src/app/services/valoracion.service';

describe('ValoracionComponent', () => {
  let component: ValoracionComponent;
  let fixture: ComponentFixture<ValoracionComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,Router,ActivatedRoute,ValoracionService],
      providers: [
        ValoracionComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(ValoracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  afterEach(()=>{
    // esperar a que no haya peticiones pendientes del test
    httpMock.verify();
  })

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
