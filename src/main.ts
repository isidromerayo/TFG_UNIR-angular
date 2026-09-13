import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideZoneChangeDetection, type EnvironmentProviders, type Provider } from '@angular/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';

const appProviders: (Provider | EnvironmentProviders)[] = [
  provideRouter(routes),
  provideHttpClient(withInterceptorsFromDi()),
  provideZoneChangeDetection({ eventCoalescing: true })
];

bootstrapApplication(AppComponent, { providers: appProviders })
  .catch(err => console.error(err));
