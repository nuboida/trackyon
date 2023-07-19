import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CallMemoResponse } from '@app/models/call-memo.model';

@Component({
  selector: 'olla-call-memo-detail',
  templateUrl: './call-memo-detail.component.html',
  styleUrls: ['./call-memo-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallMemoDetailComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: CallMemoResponse) { }

}
