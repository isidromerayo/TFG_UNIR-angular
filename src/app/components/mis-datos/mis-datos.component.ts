import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-mis-datos',
    templateUrl: './mis-datos.component.html',
    styleUrls: ['./mis-datos.component.css'],
    standalone: false
})
export class MisDatosComponent {
  
  usuario: any = {}

  constructor(private servicioLogin:AuthService) {
      this.usuario = servicioLogin.getUser()
  }
}
