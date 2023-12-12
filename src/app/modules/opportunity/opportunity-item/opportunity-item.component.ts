import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivityResponse, FileUploadRequest, FileUploadResponse, OpportunityItemResponse } from '@app/models/opportunity.model';
import { HotToastService } from '@ngneat/hot-toast';
import { ActivityCreateComponent } from '../components/activity-create/activity-create.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { getActivities, getFiles, getOpportunity, State } from '../state';
import { selectRouteParams } from 'src/app/state/router.selectors';
import { closeActivity, loadActivities, loadOpportunity, loadOpportunityFiles, uploadFile } from '../state/actions/opportunity-item-page.actions';
import { Observable, of } from 'rxjs';
import { ExcelRequest } from '@app/models/excel.model';
//import { ExcelService } from '@app/services/excel.service';

@UntilDestroy()
@Component({
  selector: 'olla-opportunity-item',
  templateUrl: './opportunity-item.component.html',
  styleUrls: ['./opportunity-item.component.scss']
})
export class OpportunityItemComponent implements OnInit {

  currentPage = 'Opportunity';
  opportunityId = '';
  opportunity!: OpportunityItemResponse;
  previousActivites!: ActivityResponse[];
  nextActivity!: ActivityResponse;
  returnRoute = '/opportunity';
  toolTip = 'Back to Opportunities';
  tip = 'Close Activity';
  displayedColumns = ['position', 'name', 'uploadedby', 'date'];
  dataSource: Observable<FileUploadResponse[]> = of([]);

  activitiesColumns = [
    'position', 'activity', 'scheduled', 'stage',
    'staff',  'created', 'status', 'action'];
  activitiesData!: ActivityResponse[];

  constructor(public dialog: MatDialog, private store: Store<State>, private toast: HotToastService,
    //private excel: ExcelService
    ) {}

  ngOnInit(): void {

    this.store.select(selectRouteParams).pipe(untilDestroyed(this)).subscribe(data => {
      this.opportunityId = data['id'];
      if (this.opportunityId) {
        this.store.dispatch(loadOpportunity({ opportunityId: this.opportunityId }));
        this.store.dispatch(loadActivities({ opportunityId: this.opportunityId }));
        this.store.dispatch(loadOpportunityFiles({ opportunityId: this.opportunityId }));
      }
    });

    this.store.select(getOpportunity).pipe(untilDestroyed(this)).subscribe(data => {
      this.opportunity = data;
      this.currentPage = this.opportunity?.name;
    });

    this.store.select(getActivities).pipe(untilDestroyed(this)).subscribe(data => {
      const activities = [...data];
      this.activitiesData = activities.sort((a, b) => +(a.dateCreated < b.dateCreated));
      this.nextActivity = activities.find(x => !x.isClosed) as ActivityResponse;
      this.previousActivites = activities.filter(x => x.isClosed).sort((a, b) => +(a.dateCreated < b.dateCreated));
    });

    this.dataSource =  this.store.select(getFiles);
  }

  createActivity(): void {
    this.openDialog(0);
  }

  editActivity(activeId: number): void {
    this.openDialog(activeId);
  }

  closeActivity(activityId: number): void {
    this.store.dispatch(closeActivity({opportunityId: this.opportunityId, activityId}));
  }

  openDialog(activityId: number): void {
    const dialogRef = this.dialog.open(ActivityCreateComponent, {
      width: '400px',
      data: {opportunityId: this.opportunityId, salesStageId: this.opportunity.stageId, activityId}
    });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.store.dispatch(loadActivities({ opportunityId: this.opportunityId }));
      }
    });
  }

  addDocument(files: FileList | null): void {
    if (files?.length) {

      const acceptableTypes = ['jpeg', 'png', 'jpg', 'pdf', 'xlsx', 'xls'];
      const filesArr = Array.from(files);

      const isValid = filesArr.every(file => {
        const filetype = file.name.split('.')[1];
        return acceptableTypes.includes(filetype);
      });

      if (!isValid) {
        this.toast.warning('Invalid Filetype');
        return;
      }

      const request: FileUploadRequest = {
        opportunityId: this.opportunityId,
        files: filesArr
      };

      this.toast.loading('Uploading...', { id: 'uploadFile'});
      this.store.dispatch(uploadFile({ request }));
    }
  }

  exportExcel(): void {
    const data = this.activitiesData.map((d, i) => {
      const [sn, opp, activity, stage, staff, isClosed] = [i + 1, d.opportunity, d.nextAction, d.opportunityStage, d.staff, d.isClosed];
      const pDate = new Date(d.proposedDate);
      const proposedDate = `${pDate.getDate()}/${pDate.getMonth() + 1}/${pDate.getFullYear()}`;
      const cDate = new Date(d.dateCreated);
      const createdDate = `${cDate.getDate()}/${cDate.getMonth() + 1}/${cDate.getFullYear()}`;
      const opportunityName = this.opportunity?.client;
      const status = isClosed ? 'Completed' : 'Not Completed'

      return {sn, opportunityName, opp, activity, proposedDate, stage, staff, createdDate, status};
    });

    const request: ExcelRequest<any> = {
      data,
      title: 'Activities',
      headers: [
        'S/N', 'Client Name', 'Opportunity Name', 'Activity', 'Schedule',
        'Stage', 'Staff', 'Created', 'Status'
      ]
    };
   // this.excel.exportExcel(request);
  }
}
