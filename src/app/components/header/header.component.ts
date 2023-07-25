import { Component } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  categorias:any[] = [];

  constructor(public servicio: HomeService) {
    servicio.getCategoriasPortada().subscribe({
      next: (respuesta): void =>  {
          console.log(respuesta)
          this.categorias = respuesta
      },
    })
  }
}
