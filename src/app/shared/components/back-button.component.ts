import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'olla-back-button',
  template: `
  <button [matTooltip]="toolTip" matTooltipPosition="after" (click)="return()" mat-icon-button color="primary" aria-label="Example icon button with a delete icon">
    <mat-icon>keyboard_backspace</mat-icon>
  </button>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackButtonComponent {

  @Input() route: string;
  @Input() toolTip: string;
  constructor(private router: Router) { }

  return(): void {
    this.router.navigate([this.route]);
  }

}
