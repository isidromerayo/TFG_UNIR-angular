import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';
import { RegistroComponent } from './components/registro/registro.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'registro', component: RegistroComponent},
  {path:'', redirectTo: '/home', pathMatch: 'full'},
  {path:'**', component: NoEncontradoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
