import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientContactCreateRequest } from '@app/models/client.model';
import { ErrorResponse } from '@app/models/error.model';
import { ClientService } from '@app/services/client.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-create-client-contact',
  template: `
    <form [formGroup]="contactForm" (ngSubmit)="addContact()">
      <div class="row">
        <div class="col-xl">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Contact Name</mat-label>
            <input formControlName="name" required matInput placeholder="Name">
          </mat-form-field>
        </div>
      </div>
      <div class="row">
        <div class="col-xl">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Phone</mat-label>
            <input formControlName="phone" required matInput placeholder="Phone">
          </mat-form-field>
        </div>
      </div>
      <div class="row">
        <div class="col-xl">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Email</mat-label>
            <input formControlName="email" required matInput placeholder="Email">
          </mat-form-field>
        </div>
      </div>
      <div class="row">
        <div class="col-xl">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Position</mat-label>
            <input formControlName="position" required matInput placeholder="Position">
          </mat-form-field>
        </div>
      </div>
      <div class="d-flex">
        <button class="btn btn-block btn-outline-primary" [disabled]="!contactForm.valid">
          <span *ngIf="!loading">Create</span>
          <div *ngIf="loading" class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </button>
    </div>
    </form>

  `,
  styles: []
})
export class CreateClientContactComponent implements OnInit {

  loading = false;
  contactForm!: FormGroup;
  data: ClientContactCreateRequest = {
    name: '',
    phone: '',
    email: '',
    position: '',
    clientId: '',
  };

  nameCtrl = new FormControl(this.data.name, Validators.required);
  phoneCtrl = new FormControl(this.data.phone, Validators.required);
  emailCtrl = new FormControl(this.data.email, [Validators.required, Validators.email]);
  positionCtrl = new FormControl(this.data.position, Validators.required);

  constructor(private fb: FormBuilder, private clientService: ClientService, private toast: HotToastService,
              public dialogRef: MatDialogRef<CreateClientContactComponent>,
              @Inject(MAT_DIALOG_DATA) public info: {clientId: string}) {
      this.data.clientId = info.clientId;
    }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: this.nameCtrl,
      phone: this.phoneCtrl,
      email: this.emailCtrl,
      position: this.positionCtrl
    });
  }

  addContact(): void {
    this.loading = true;
    const request = {...this.data, ...this.contactForm.value} as ClientContactCreateRequest;
    this.clientService.createClientContact(request).pipe(untilDestroyed(this)).subscribe(
      resp => {
        this.toast.success('Contact Added');
        this.dialogRef.close(resp.message);
      },
      (err: ErrorResponse) => {
        this.loading = false;
        this.toast.error(err.message);
      }
    );
  }

}
