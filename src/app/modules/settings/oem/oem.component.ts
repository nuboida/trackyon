import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OemResponse } from '@app/models/oem.model';
import { OemService } from '@app/services/oem.service';
import { HotToastService } from '@ngneat/hot-toast';
import { OemCreateComponent } from './oem-create/oem-create.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@UntilDestroy()
@Component({
  selector: 'olla-oem',
  templateUrl: './oem.component.html',
  styleUrls: ['./oem.component.scss']
})
export class OemComponent implements OnInit, AfterViewInit {

  currentPage = 'OEMs';
  btnText = 'OEM';
  cardText = 'OEM';
  imageSrc = 'assets/goals.svg';
  displayedColumns = ['position', 'oem'];
  addToolTip = 'New OEM';
  dataSource = new MatTableDataSource<OemResponse>([]);
  loading = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private oemService: OemService, public dialog: MatDialog,
              private toast: HotToastService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.pipe(untilDestroyed(this)).subscribe(result => this.dataSource.data = result.data);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getOems(): void {
    this.oemService.getOems().pipe(untilDestroyed(this)).subscribe(
      data => this.dataSource.data = data,
      () => this.toast.error('Error retrieving OEMs'),
      () => this.loading = false
    );
  }

  createOem(): void {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(OemCreateComponent, { width: '400px' });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.getOems();
      }
    });
  }

}
