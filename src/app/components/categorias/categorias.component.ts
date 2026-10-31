import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
    selector: 'app-categorias',
    templateUrl: './categorias.component.html',
    styleUrls: ['./categorias.component.css'],
    standalone: true,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CommonModule, RouterModule]
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
