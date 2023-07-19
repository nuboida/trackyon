import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { StaffService } from '@app/services/staff.service';
import { HotToastService } from '@ngneat/hot-toast';
import { StaffCreateComponent } from './staff-create/staff-create.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StaffResponse } from '@app/models/staff.model';
import { StaffDetailsComponent } from './staff-details/staff-details.component';

@UntilDestroy()
@Component({
  selector: 'olla-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit, AfterViewInit {

  currentPage = 'Staff';
  btnText = 'Staff';
  cardText = 'staff';
  imageSrc = 'assets/Team.svg';
  addToolTip = 'New Staff';
  toolTip= 'Actions';

  displayedColumns = ['position', 'staff', 'phone', 'email', 'department', 'role', 'status', 'buttons', 'moreButtons'];
  dataSource = new MatTableDataSource<StaffResponse>([]);
  loading = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private staffService: StaffService, public dialog: MatDialog,
              private toast: HotToastService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.pipe(untilDestroyed(this)).subscribe(result => this.dataSource.data = result.data);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  createStaff(): void {
    this.openDialog();
  }

  getStaffs(): void {
    this.staffService.getStaffs().pipe(untilDestroyed(this)).subscribe(
      data => this.dataSource.data = data,
      () => this.toast.error('Error retrieving staffs'),
      () => this.loading = false
    );
  }

  editStaff(staffId: string): void {
    this.openDialog(staffId);
  }

  openDialog(staffId?: string): void {
    const dialogRef = this.dialog.open(StaffCreateComponent, { width: '700px', height: '500px', data: {staffId} });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.getStaffs();
      }
    });
  }

  deactivateStaff(staffId: string): void {
    this.staffService.deactivateStaff(staffId).pipe(untilDestroyed(this))
    .subscribe(
      () => {
        this.toast.success('Deactivated');
        this.getStaffs();
      },
      () => this.toast.error('Failed to deactivate')
    );
  }

  activateStaff(staffId: string): void {
    this.staffService.activateStaff(staffId).pipe(untilDestroyed(this))
    .subscribe(
      () => {
        this.toast.success('Activated');
        this.getStaffs();
      },
      () => this.toast.error('Failed to activate')
    );
  }

  viewStaff(staffId: string): void {
    const staff = {...this.dataSource.data.find(x => x.staffId === staffId)};

    this.dialog.open(StaffDetailsComponent, {
      width: '600px',
      height: '550px',
      data: staff
    });
  }

}
