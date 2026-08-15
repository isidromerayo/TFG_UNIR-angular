import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.css'],
    standalone: true,
    imports: [FormsModule]
})
export class SliderComponent {
  query_string = '';

  constructor(private readonly _route: ActivatedRoute, private readonly _router: Router) {
  }

  goSearch(){
    this._router.navigate(['/buscar/',this.query_string])
  }
}
