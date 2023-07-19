import { Component } from '@angular/core';
import { fadeAnimation } from '@shared/animations/animation';

@Component({
  selector: 'olla-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent {}
