import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ClientCreateRequest } from '@app/models/client.model';
import { ErrorResponse } from '@app/models/error.model';
import { ClientService } from '@app/services/client.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-create-client',
  template: `
    <form [formGroup]="clientForm" (ngSubmit)="addClient()">
      <div class="row">
        <div class="col-xl">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Client</mat-label>
            <input formControlName="name" required matInput placeholder="Client">
          </mat-form-field>
        </div>
      </div>
      <div class="row">
        <div class="col-xl">
          <mat-checkbox formControlName="isProspective">Prospective</mat-checkbox>
        </div>
      </div>
      <div class="d-flex">
        <button class="btn btn-block btn-outline-primary" [disabled]="!clientForm.valid">
          <span *ngIf="!loading">Create</span>
          <div *ngIf="loading" class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </button>
    </div>
    </form>

  `,
  styles: [
  ]
})
export class CreateClientComponent implements OnInit {

  loading = false;
  clientForm!: FormGroup;
  data: ClientCreateRequest = {
    name: '',
    isProspective: false,
    companyId: ''
  };

  nameCtrl = new FormControl(this.data.name, Validators.required);
  isProspectiveCtrl = new FormControl(this.data.isProspective);
  constructor(private fb: FormBuilder, private clientService: ClientService,
              public dialogRef: MatDialogRef<CreateClientComponent>,
              private toast: HotToastService) { }

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      name: this.nameCtrl,
      isProspective: this.isProspectiveCtrl
    });
  }

  addClient(): void {
    this.loading = true;
    const request = {...this.data, ...this.clientForm.value} as ClientCreateRequest;
    this.clientService.createClient(request).pipe(untilDestroyed(this)).subscribe(
      resp => {
        this.toast.success('Client Added');
        this.dialogRef.close(resp.message);
      },
      (err: ErrorResponse) => {
        this.loading = false;
        this.toast.error(err.message);
      }
    );
  }

}
