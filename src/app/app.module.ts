import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SliderComponent } from './components/slider/slider.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule } from '@angular/forms';
import { MisCursosComponent } from './components/mis-cursos/mis-cursos.component';

@NgModule({ declarations: [
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        MisCursosComponent,
        AppComponent,
        SliderComponent,
        HomeComponent
    ], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
