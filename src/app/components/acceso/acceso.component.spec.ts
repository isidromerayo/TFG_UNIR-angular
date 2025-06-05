import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AccesoComponent } from './acceso.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AccesoComponent', () => {
  let component: AccesoComponent;
  let fixture: ComponentFixture<AccesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AccesoComponent],
    imports: [FormsModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});