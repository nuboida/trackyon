import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterByOpenClosed, FilterByOpportunityStage, OpportunityFilter, OpportunityResponse } from '@app/models/opportunity.model';
import { OpportunityCreateComponent } from '../components/opportunity-create/opportunity-create.component';
import { StageUpdateComponent } from '../components/stage-update/stage-update.component';
import { ExcelService } from '@app/services/excel.service';
import { ExcelRequest } from '@app/models/excel.model';
import { MarginCalculatorComponent } from '../components/margin-calculator/margin-calculator.component';
import { ClientResponse } from '@app/models/client.model';
import { ClientService } from '@app/services/client.service';
import { Observable } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { getOpportunities, getOpportunitiesFilter, getOpportunitiesLoading, State } from '../state';
import {
  loadClientOpportunities, loadDaterangeOpportunities, loadHalfYearOpportunities,
  loadMainStaffOpportunities,
  loadMonthOpportunities,
  loadOpportunities, loadQuarterOpportunities,
  loadYearClosedOpportunities, loadYearOpenOpportunities,
  loadYearOpportunities, resetFilter
} from '../state/actions/opportunity-list-page.actions';
import { StaffResponse } from '@app/models/staff.model';
import { StaffService } from '@app/services/staff.service';
import { FormControl } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'olla-opportunity-list',
  templateUrl: './opportunity-list.component.html',
  styleUrls: ['./opportunity-list.component.scss']
})
export class OpportunityListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['position', 'client', 'opportunity', 'price', 'margin', 'status', 'date', 'button'];
  dataSource = new MatTableDataSource<OpportunityResponse>([]);
  AllData: OpportunityResponse[] = [];
  tempData: OpportunityResponse[] = [];
  toolTip = 'Actions';
  tip = 'Create Opportunity';
  currentPage = 'Opportunities';
  btnText = 'Opportunity';
  cardText = 'opportunity';
  imageSrc = 'assets/business_deal.svg';

  filter: OpportunityFilter;
  dateFilter = {
    startTime: new Date(),
    endTime: new Date,
  };
  filterOptions = Filters;
  yearOptions = Years;
  halfOptions = Halves;
  quarterOptions = Quarters;
  monthOptions = Months;
  openClosedOptions = OpenClosedOptions;
  filterOpenClosed = false;
  filterByOpenClosed: FilterByOpenClosed = {
    value: 0
  }
  opportunityStagesOptions = OpportunityStages;
  datePicker!: Date;
  isLoading$ = this.store.select(getOpportunitiesLoading);
  clients$!: Observable<ClientResponse[]>;
  staff$!: Observable<StaffResponse[]>;
  filterStagesOptions = false;
  filterOpenClosedByUser: FormControl = new FormControl('');
  filterByStage: FilterByOpportunityStage = {
    value: 0
  };
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private excel: ExcelService, private clientService: ClientService,
              private toast: HotToastService, private store: Store<State>, private staffService: StaffService) { }

  ngOnInit(): void {
    this.store.select(getOpportunities).pipe(untilDestroyed(this)).subscribe(
      data => {
        this.dataSource.data = data
        this.AllData = data;
      }
    );

    this.store.select(getOpportunitiesFilter).pipe(untilDestroyed(this)).subscribe(
      filter => this.filter = {...filter}
    );

    this.store.dispatch(loadOpportunities());
    this.clients$ = this.clientService.getClients();
    this.staff$ = this.staffService.getStaffs();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private formatDate(date: Date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

  filterOpportunities(): void {
    switch (this.filter.option) {
      case 1:
        this.store.dispatch(loadMainStaffOpportunities({staffId: this.filter.staffId}));
        this.filterStagesOptions = true;
        this.filterByStage.value = 0;
        break;
      case 2:
        this.getOpportunitiesByClient();
        break;
      case 3:
        this.store.dispatch(loadYearOpportunities({year: this.filter.year}));
        this.filterOpenClosed = true;
        this.filterByOpenClosed.value = 1;
        break;
      case 4:
        this.store.dispatch(loadHalfYearOpportunities({ year: this.filter.year, half: this.filter.half }));
        break;
      case 5:
        this.store.dispatch(loadQuarterOpportunities({ year: this.filter.year, quarter: this.filter.quarter }));
        break;
      case 6:
        this.store.dispatch(loadMonthOpportunities({year: this.filter.year, month: this.filter.month}))
        break;
      case 7:
        const startTime = this.formatDate(this.dateFilter.startTime);
        const endTime = this.formatDate(this.dateFilter.endTime);

        this.store.dispatch(loadDaterangeOpportunities({request: {...this.dateFilter, startTime: startTime, endTime: endTime}}));
        break;
      default:
        this.store.dispatch(loadOpportunities());
        break;
    }
  }

  filterStages(): void {
    let selectedStage = this.opportunityStagesOptions.filter((c) => c.value === this.filterByStage.value)[0].name;
    this.dataSource.data = this.AllData;
    if (selectedStage == 'All') {
      return;
    };
    this.dataSource.data = this.dataSource.data.filter((c) => c.stage === selectedStage);
  }

  filterOpportunitiesByOpenClosed(): void {
    this.filterOpenClosedByUser.reset();
    let selectedOption = this.openClosedOptions.filter((c) => c.value === this.filterByOpenClosed.value)[0].value;
    this.dataSource.data = this.AllData;

    switch (selectedOption) {
      case 1:
        this.tempData = this.AllData;
        break;
      case 2:
        this.dataSource.data = this.dataSource.data.filter((c) => !c.stage.includes('Closed') && !c.stage.includes('Payment'));
        this.tempData = this.dataSource.data;
        break;
      case 3:
        this.dataSource.data = this.dataSource.data.filter((c) => c.stage.includes('Closed') && c.margin !== 0);
        this.tempData = this.dataSource.data;
        break;
      case 4:
        this.dataSource.data = this.dataSource.data.filter((c) => c.stage.includes('Closed') && c.margin < 1);
        this.tempData = this.dataSource.data;
        break;
      case 5:
        this.dataSource.data = this.dataSource.data.filter((c) => c.stage.includes('Payment'));
        this.tempData = this.dataSource.data;
        break;
      default:
        break;
    }
  }

  filterByUser(): void {
    this.dataSource.data = this.tempData;
    this.staff$.pipe(untilDestroyed(this)).subscribe(
      data => {
        const selectedStaff = data.filter((c) => c.staffId === this.filterOpenClosedByUser.value)[0];
        const selectedStaffName = `${selectedStaff.firstName} ${selectedStaff.lastName}`;
        this.dataSource.data = this.dataSource.data.filter((c) => c.staff === `${selectedStaffName}`);
      }
    )
  }

  getOpportunitiesByClient(): void {
    if (!this.filter.clientId) {
      this.toast.warning('Select a Client');
      return;
    }
    const request = {
      clientId: this.filter.clientId,
      date: this.formatDate(this.datePicker)
    }
    this.store.dispatch(loadClientOpportunities({request}));
  }

  createOpportunity(): void {
    this.openDialog();
  }

  editOpportunity(opportunityId: string): void {
    this.openDialog(opportunityId);
  }

  updateStage(opportunityId: string): void {
    const dialogRef = this.dialog.open(StageUpdateComponent, {
      width: '400px', data: {opportunityId}
    });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.filterOpportunities();
      }
    });
  }

  openDialog(opportunityId?: string): void {
    const dialogRef = this.dialog.open(OpportunityCreateComponent, {
      height: '600px',
      width: '600px',
      data: { opportunityId }
    });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.store.dispatch(resetFilter());
        this.filterOpportunities();
      }
    });
  }

  openCalculator(): void {
    this.dialog.open(MarginCalculatorComponent, {
      height: '500px',
      width: '600px',
    });
  }

  private numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

  exportExcel(): void {
    const data = this.dataSource.data.map((d, i) => {
      const [sn, staff, acc, opp, stage, type] = [i + 1, d.staff, d.client, d.name, d.stage, d.businessType];
      const [period, amount, percent, next] = [d.fiscalPeriod, this.numberWithCommas(d.sellingPrice), d.percentage, d.nextStep];
      const useDate = new Date(d.createdDate);
      const date = `${useDate.getDate()}/${useDate.getMonth() + 1}/${useDate.getFullYear()}`;

      return { sn, staff, acc, opp, period, stage, percent, amount, type, date, next };
    });

    const request: ExcelRequest<any> = {
      data,
      title: 'Opportunities',
      headers: [
        'S/N', 'Staff', 'Account Name', 'Opportunity Name',
        'Period', 'Stage', 'Percentage', 'Amount', 'Type', 'Created Date', 'Activities'
      ]
    };

    this.excel.exportExcel(request);
  }
}

interface Option {
  name: string;
  value: number;
}

const Filters: Option[] = [
  { name: 'All', value: 0 },
  { name: 'User', value: 1 },
  { name: 'Clients', value: 2 },
  { name: 'Year', value: 3 },
  { name: 'Half Year', value: 4 },
  { name: 'Quarter', value: 5 },
  { name: 'Month', value: 6 },
  { name: 'Week', value: 7 }
];

const Years: Option[] = [
  {name: '2021', value: 2021 },
  {name: '2022', value: 2022 },
  {name: '2023', value: 2023 },
];

const OpenClosedOptions: Option[] = [
  {name: 'All', value: 1 },
  {name: 'Open', value: 2 },
  {name: 'Closed (Won)', value: 3 },
  {name: 'Closed (Lost)', value: 4 },
  {name: 'Payment Received', value: 5 },
];

const Halves: Option[] = [
  { name: 'First Half', value: 1 },
  { name: 'Second Half', value: 2 }
];

const Quarters: Option[] = [
  { name: 'First Quarter', value: 1 },
  { name: 'Second Quarter', value: 2 },
  { name: 'Third Quarter', value: 3 },
  { name: 'Fourth Quarter', value: 4 }
];

const Months: Option[] = [
  { name: 'January', value: 1 },
  { name: 'February', value: 2 },
  { name: 'March', value: 3 },
  { name: 'April', value: 4 },
  { name: 'May', value: 5 },
  { name: 'June', value: 6 },
  { name: 'July', value: 7 },
  { name: 'August', value: 8 },
  { name: 'September', value: 9 },
  { name: 'October', value: 10 },
  { name: 'November', value: 11 },
  { name: 'December', value: 12 },
];

const OpportunityStages: Option[] = [
  { name: 'All', value: 0 },
  { name: 'Initiation', value: 1 },
  { name: 'Qualification', value: 2 },
  { name: 'Solution Development', value: 3 },
  { name: 'Solotuion Presentation', value: 4 },
  { name: 'Negotiation & Approvals', value: 5 },
  { name: 'Closed Won/Loss', value: 6 },
  { name: 'Payment Received', value: 7 },
]
