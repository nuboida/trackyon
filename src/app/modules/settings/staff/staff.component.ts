import { AfterViewInit, Component, OnInit, ViewChildren, QueryList } from '@angular/core';
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
  activeDataSource = new MatTableDataSource<StaffResponse>([]);
  inactiveDataSource = new MatTableDataSource<StaffResponse>([]);
  loading = false;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(private staffService: StaffService, public dialog: MatDialog,
              private toast: HotToastService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.pipe(untilDestroyed(this)).subscribe(result => {
      this.activeDataSource.data = result.data.filter((c: StaffResponse) => c.active);
      this.inactiveDataSource.data = result.data.filter((c: StaffResponse) => !c.active);
    });
  }

  ngAfterViewInit(): void {
    this.activeDataSource.paginator = this.paginator.toArray()[0];
    this.inactiveDataSource.paginator = this.paginator.toArray()[1];
  }

  createStaff(): void {
    this.openDialog();
  }

  getStaffs(): void {
    this.staffService.getStaffs().pipe(untilDestroyed(this)).subscribe(
      data => {
        this.activeDataSource.data = data.filter((c: StaffResponse) => c.active)
        this.inactiveDataSource.data = data.filter((c: StaffResponse) => !c.active)
      },
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
    const staff = {...this.activeDataSource.data.find(x => x.staffId === staffId)};

    this.dialog.open(StaffDetailsComponent, {
      width: '600px',
      height: '550px',
      data: staff
    });
  }

}
