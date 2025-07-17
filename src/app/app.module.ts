import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SliderComponent } from './components/slider/slider.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { AccesoComponent } from './components/acceso/acceso.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { CursoComponent } from './components/curso/curso.component';
import { FormsModule } from '@angular/forms';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
import { ValoracionComponent } from './components/valoracion/valoracion.component';
import { MisCursosComponent } from './components/mis-cursos/mis-cursos.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MisDatosComponent } from './components/mis-datos/mis-datos.component';

@NgModule({ declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        SliderComponent,
        HomeComponent,
        RegistroComponent,
        NoEncontradoComponent,
        CategoriasComponent,
        CarritoComponent,
        AccesoComponent,
        CategoriaComponent,
        CursoComponent,
        BusquedaComponent,
        ValoracionComponent,
        MisDatosComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        SweetAlert2Module.forRoot(),
        MisCursosComponent
    ], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
