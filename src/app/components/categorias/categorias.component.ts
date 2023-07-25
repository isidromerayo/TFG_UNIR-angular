import { Component } from '@angular/core';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent {

  categorias:any = []

  constructor(public servicio: CategoriaService){
    servicio.getAllCategorias().subscribe({
      next: (respuesta): void => { 
        this.categorias = respuesta;
    },
    error: (err) => { console.error(err)  }
    })
  }
}
