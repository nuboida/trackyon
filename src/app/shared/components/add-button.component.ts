import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'olla-add-button',
  template: `
    <div class="d-flex justify-content-end">
      <button [matTooltip]="toolTip" matTooltipPosition="before" (click)="createNew()"
      mat-mini-fab [color]="color" aria-label="Example icon button with a delete icon"
      [disabled]="disabled">
        <mat-icon>{{icon}}</mat-icon>
      </button>
    </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddButtonComponent {

  @Input() toolTip!: string;
  @Input() color = 'primary';
  @Input() icon = 'add';
  @Input() disabled = false;
  @Output() create = new EventEmitter<void>();

  createNew(): void {
    this.create.emit();
  }

}
