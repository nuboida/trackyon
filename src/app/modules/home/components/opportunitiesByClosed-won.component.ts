import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OpportunityResponse } from '@app/models/opportunity.model';

@Component({
  selector: 'olla-opportunities-won-table',
  template:`
  <mat-card class="shadow br-20">
      <div class="header">
        <h6>Closed Opportunities - Won</h6>
      </div>
      <div class="sales-table of-auto">
        <table mat-table [dataSource]="dataSource" class="border w-10">

          <!-- Position Column -->
          <ng-container matColumnDef="position">
            <th mat-header-cell *matHeaderCellDef> No. </th>
            <td mat-cell *matCellDef="let element; index as i" style="font-size: 12px;"> {{i+1}} </td>
          </ng-container>

          <!-- Client Column -->
          <ng-container matColumnDef="client">
            <th mat-header-cell *matHeaderCellDef> Client </th>
            <td mat-cell *matCellDef="let element" style="font-size: 12px;"> {{element.client}}</td>
          </ng-container>

          <!-- Opportunity Column -->
          <ng-container matColumnDef="opportunity">
            <th mat-header-cell *matHeaderCellDef> Opportunity </th>
            <td mat-cell *matCellDef="let element" style="font-size: 12px;"> {{element.name}} </td>
          </ng-container>

          <!-- Price Column -->
          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef> Price </th>
            <td mat-cell *matCellDef="let element" style="font-size: 12px;"> {{element.sellingPrice |currency:'USD':'symbol':'1.2-2'}} </td>
          </ng-container>

          <!-- Cost Column -->
          <ng-container matColumnDef="cost">
            <th mat-header-cell *matHeaderCellDef> Cost </th>
            <td mat-cell *matCellDef="let element" style="font-size: 12px;"> {{element.costPrice |currency:'USD':'symbol':'1.2-2'}} </td>
          </ng-container>

          <!-- Margin Column -->
          <ng-container matColumnDef="margin">
            <th mat-header-cell *matHeaderCellDef> Margin </th>
            <td mat-cell *matCellDef="let element" style="font-size: 12px;"> {{element.margin |currency:'USD':'symbol':'1.2-2'}} </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Stage </th>
            <td mat-cell *matCellDef="let element" style="font-size: 12px;"> Closed/Won</td>
          </ng-container>

          <!-- Date Column -->
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef> Created On</th>
            <td mat-cell *matCellDef="let element" style="font-size: 12px;"> {{element.createdDate |date:'mediumDate'}} </td>
          </ng-container>

          <!-- Staff Column -->
          <ng-container matColumnDef="staff">
            <th mat-header-cell *matHeaderCellDef> Staff </th>
            <td mat-cell *matCellDef="let element" style="font-size: 12px;"> {{(element.staff.split(' ')[0])}} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </mat-card>
  `,
})
export class OpportunitiesWonComponent implements OnInit {
  @Input() opportunities!: OpportunityResponse[];
  displayedColumns: string[] = ['position', 'client', 'opportunity', 'price', 'cost', 'margin', 'status', 'date', 'staff'];
  dataSource = new MatTableDataSource<OpportunityResponse>([]);

  ngOnInit(): void {
    this.dataSource.data = this.opportunities;
  }
}

