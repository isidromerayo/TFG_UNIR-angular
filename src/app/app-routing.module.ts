import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';
import { RegistroComponent } from './components/registro/registro.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { AccesoComponent } from './components/acceso/acceso.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { CursoComponent } from './components/curso/curso.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'registro', component: RegistroComponent},
  {path:'categorias', component: CategoriasComponent},
  {path:'categoria/:id', component: CategoriaComponent},
  {path:'curso/:id', component: CursoComponent},
  {path: 'buscar/:search', component: BusquedaComponent},
  {path:'carrito', component: CarritoComponent},
  {path:'acceso', component: AccesoComponent},
  {path:'', redirectTo: '/home', pathMatch: 'full'},
  {path:'**', component: NoEncontradoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
