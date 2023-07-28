import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent {
  public query_string: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.query_string = '';
  }

  goSearch(){
    this._router.navigate(['/buscar/',this.query_string])
  }
}
