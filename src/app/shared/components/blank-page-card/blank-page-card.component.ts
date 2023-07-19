import { Component, Output, Input, EventEmitter, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'olla-blank-page-card',
  templateUrl: './blank-page-card.component.html',
  styleUrls: ['./blank-page-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlankPageCardComponent {

  @Input()
  imageSrc!: string;
  @Input()
  cardText!: string;
  @Input()
  btnText!: string;
  @Output() create = new EventEmitter<void>();

  createNew(): void {
    this.create.emit();
  }

}
