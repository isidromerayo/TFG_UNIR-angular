import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { SliderComponent } from '../slider/slider.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, SliderComponent]
})

export class HomeComponent {
    home:boolean=true;
    cursos:any[] = [];
    opiniones:any[] = [];
    actualizaciones:any[] = [];

    constructor(public servicio: HomeService) {
       servicio.getCursosDestacadosPortada().subscribe({next: (respuesta): void => {
        this.cursos = respuesta;
      }})
      servicio.getOpinionesCursosPortada().subscribe({next: (respuesta): void => {
        this.opiniones=respuesta
      }, error: (err) => {
        console.error("getOpinionesCursosPortada")
      }})
      servicio.getCursosUltimasPortada().subscribe({
        next: (respuesta): void => { 
            this.actualizaciones = respuesta;
        },
        error: (err) => { console.error(err)  },
      })
    }
}
