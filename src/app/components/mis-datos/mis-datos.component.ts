import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-mis-datos',
    templateUrl: './mis-datos.component.html',
    styleUrls: ['./mis-datos.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class MisDatosComponent {
  
  usuario: any = {}

  constructor(private servicioLogin:AuthService) {
      this.usuario = servicioLogin.getUser()
  }
}
