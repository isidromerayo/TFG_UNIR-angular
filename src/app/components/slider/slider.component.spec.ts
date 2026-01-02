import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SliderComponent } from './slider.component';

describe('SliderComponent', () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SliderComponent],
      imports: [FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize query_string as empty string', () => {
    expect(component.query_string).toBe('');
  });

  describe('goSearch', () => {
    it('should navigate to search with query string', () => {
      component.query_string = 'Angular';

      component.goSearch();

      expect(router.navigate).toHaveBeenCalledWith(['/buscar/', 'Angular']);
    });

    it('should navigate with empty query string', () => {
      component.query_string = '';

      component.goSearch();

      expect(router.navigate).toHaveBeenCalledWith(['/buscar/', '']);
    });

    it('should navigate with special characters in query', () => {
      component.query_string = 'C++ Programming';

      component.goSearch();

      expect(router.navigate).toHaveBeenCalledWith(['/buscar/', 'C++ Programming']);
    });

    it('should navigate with numbers in query', () => {
      component.query_string = 'Angular 2024';

      component.goSearch();

      expect(router.navigate).toHaveBeenCalledWith(['/buscar/', 'Angular 2024']);
    });

    it('should navigate with long query string', () => {
      component.query_string = 'Advanced Angular Framework Tutorial';

      component.goSearch();

      expect(router.navigate).toHaveBeenCalledWith(['/buscar/', 'Advanced Angular Framework Tutorial']);
    });

    it('should update query_string and navigate', () => {
      component.query_string = 'React';
      component.goSearch();

      expect(router.navigate).toHaveBeenCalledWith(['/buscar/', 'React']);

      component.query_string = 'Vue';
      component.goSearch();

      expect(router.navigate).toHaveBeenCalledWith(['/buscar/', 'Vue']);
    });
  });
});
