import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '@app/services/client.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ClientContactResponse } from '@app/models/client.model';
import { CreateClientContactComponent } from '@shared/components/create-client-contact.component';

@UntilDestroy()
@Component({
  selector: 'olla-client-contact',
  templateUrl: './client-contact.component.html',
  styleUrls: ['./client-contact.component.scss']
})
export class ClientContactComponent implements OnInit, AfterViewInit {

  currentPage = 'Contacts';
  btnText = 'Contact';
  cardText = 'contact';
  imageSrc = 'assets/contact.svg';
  displayedColumns = ['sno', 'name', 'phone', 'email', 'position'];
  clientId = '';
  returnRoute = '/settings/client';
  toolTip = 'Back to Clients';
  addToolTip = 'New Contact';
  dataSource = new MatTableDataSource<ClientContactResponse>([]);
  loading = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private clientService: ClientService, public dialog: MatDialog,
              private toast: HotToastService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.pipe(untilDestroyed(this)).subscribe(result => this.dataSource.data = result.data);
    this.route.params.pipe(untilDestroyed(this)).subscribe(params => {
      this.clientId = params.id as string;
      this.getClientInfo();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  createContact(): void {
    this.openDialog();
  }

  getClientInfo(): void {
    this.clientService.getClient(this.clientId).pipe(untilDestroyed(this))
    .subscribe(
      data => this.currentPage = `${data.name} Contacts`
    );
  }

  getContacts(): void {
    this.clientService.getClientContacts(this.clientId).pipe(untilDestroyed(this))
    .subscribe(
      data => this.dataSource.data = data,
      () => this.toast.error('Error getting contacts'),
      () => this.loading = false
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateClientContactComponent, {
      width: '400px',
      data: { clientId: this.clientId }
    });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.getContacts();
      }
    });
  }

}
