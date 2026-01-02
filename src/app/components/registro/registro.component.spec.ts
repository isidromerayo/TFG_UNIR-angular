import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { RegistroComponent } from './registro.component';
import { UsuarioService } from 'src/app/services/usuario.service';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;

  beforeEach(() => {
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', ['crear']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [RegistroComponent],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService }
      ]
    });
    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
