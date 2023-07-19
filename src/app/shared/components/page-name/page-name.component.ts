import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'olla-page-name',
  templateUrl: './page-name.component.html',
  styleUrls: ['./page-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNameComponent {

  @Input() currentPage = '';

}
