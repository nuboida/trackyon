import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OemContactResponse } from '@app/models/oem.model';
import { OemService } from '@app/services/oem.service';
import { HotToastService } from '@ngneat/hot-toast';
import { OemContactCreateComponent } from '../oem-contact-create/oem-contact-create.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@UntilDestroy()
@Component({
  selector: 'olla-oem-contact',
  templateUrl: './oem-contact.component.html',
  styleUrls: ['./oem-contact.component.scss']
})
export class OemContactComponent implements OnInit, AfterViewInit {

  currentPage = 'Contacts';
  btnText = 'Contact';
  cardText = 'contact';
  imageSrc = 'assets/contact.svg';
  displayedColumns = ['position', 'name', 'phone', 'email', 'main'];
  oemId = '';
  returnRoute = '/settings/oem';
  toolTip = 'Back to OEMs';
  addToolTip = 'New Contact';
  dataSource = new  MatTableDataSource<OemContactResponse>([]);
  loading = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private oemService: OemService, public dialog: MatDialog,
              private toast: HotToastService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.pipe(untilDestroyed(this)).subscribe(result => this.dataSource.data = result.data);
    this.route.params.subscribe(params => {
      this.oemId = params.id as string;
      this.getOemInfo();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  createContact(): void {
    this.openDialog();
  }

  getOemInfo(): void {
    this.oemService.getOem(this.oemId).pipe(untilDestroyed(this)).subscribe(
      data => this.currentPage = `${data.name} Contacts`
    );
  }

  getContacts(): void {
    this.oemService.getOemContacts(this.oemId).pipe(untilDestroyed(this)).subscribe(
      data => this.dataSource.data = data,
      () => this.toast.error('Error retrieving contacts'),
      () => this.loading = false
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(OemContactCreateComponent, {
      width: '400px' ,
      data: { oemId: this.oemId }
    });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.getContacts();
      }
    });
  }

}
