import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-mis-datos',
    templateUrl: './mis-datos.component.html',
    styleUrls: ['./mis-datos.component.css'],
    standalone: true,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CommonModule]
})
export class MisDatosComponent {
  
  usuario: any = {}

  constructor(private readonly servicioLogin:AuthService) {
      this.usuario = servicioLogin.getUser()
  }
}
