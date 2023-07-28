import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {

  myCart$ = this.carrito.myCart$

  constructor(public carrito: CarritoService, private _route: ActivatedRoute, private _router: Router){
  }
  
}
