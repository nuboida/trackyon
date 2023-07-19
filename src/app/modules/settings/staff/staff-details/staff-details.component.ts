import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StaffResponse } from '@app/models/staff.model';

@Component({
  selector: 'olla-staff-details',
  templateUrl: './staff-details.component.html',
  styleUrls: ['./staff-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffDetailsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: StaffResponse
  ) { }

  ngOnInit() {

  }

}
