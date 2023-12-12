import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientResponse } from '@app/models/client.model';
import { ClientService } from '@app/services/client.service';
// import { ExcelService } from '@app/services/excel.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreateClientComponent } from '@shared/components/create-client.component';

@UntilDestroy()
@Component({
  selector: 'olla-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, AfterViewInit {

  currentPage = 'Clients';
  btnText = 'Client';
  cardText = 'client';
  imageSrc = 'assets/client.svg';
  displayedColumns = ['position', 'client', 'prospective'];
  addToolTip = 'New Client';
  dataSource = new MatTableDataSource<ClientResponse>([]);
  loading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private clientService: ClientService, public dialog: MatDialog,
    //public ete: ExcelService,
    private toast: HotToastService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.pipe(untilDestroyed(this)).subscribe(result => this.dataSource.data = result['data']);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  createClient(): void {
    this.openDialog();
  }

  getClients(): void {
    this.loading = true;
    this.clientService.getClients().pipe(untilDestroyed(this)).subscribe(
      data => this.dataSource.data = data,
      () => this.toast.error('Error retrieving clients'),
      () => this.loading = false
    );
  }

  viewClient(clientId: string): void {
    this.router.navigate([clientId], { relativeTo: this.route });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateClientComponent, { width: '400px' });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.getClients();
      }
    });
  }

}
