import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientContactResponse, ClientResponse } from '@app/models/client.model';
import { ErrorResponse } from '@app/models/error.model';
import { OemResponse } from '@app/models/oem.model';
import {
  BusinessType, ClassificationResponse, DeliveryStatusResponse,
  OpportunityCreateRequest, OpportunityUpdateRequest, Stage
} from '@app/models/opportunity.model';
import { StaffResponse } from '@app/models/staff.model';
import { ClientService } from '@app/services/client.service';
import { OemService } from '@app/services/oem.service';
import { OpportunityService } from '@app/services/opportunity.service';
import { StaffService } from '@app/services/staff.service';
import { HotToastService } from '@ngneat/hot-toast';
import { onlyNumberValidator } from '@shared/validators/numbers-only.validator';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CreateClientComponent } from '@shared/components/create-client.component';
import { CreateClientContactComponent } from '@shared/components/create-client-contact.component';

@UntilDestroy()
@Component({
  selector: 'olla-opportunity-create',
  templateUrl: './opportunity-create.component.html',
  styleUrls: ['./opportunity-create.component.scss']
})
export class OpportunityCreateComponent implements OnInit {

  loading = false;
  oems$!: Observable<OemResponse[]>;
  stages$!: Observable<Stage[]>;
  clients$!: Observable<ClientResponse[]>;
  clientContacts$!: Observable<ClientContactResponse[]>;
  businessTypes$!: Observable<BusinessType[]>;
  classifications$!: Observable<ClassificationResponse[]>;
  staffs$!: Observable<StaffResponse[]>;
  deliveryStatuses$: Observable<DeliveryStatusResponse[]>;
  form!: FormGroup;
  minDate = new Date();
  nullValue: null = null;
  opportunityId: string;

  data: OpportunityCreateRequest | OpportunityUpdateRequest = {
    clientId: '',
    staffId: '',
    name: '',
    opportunityStageId: 0,
    companyId: '',
    description: '',
    businessTypeId: 0,
    opportunityClassificationId: 0,
    clientContactId: 0,
    oemIds: [],
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    training: 0,
    otherFees: 0,
    opportunityTeam: [],
    amountPaid: 0,
    rate: 0,
    invoiceNumber: '',
    datePaymentReceived: null,
    deliveryStatusId: 2,
    dateOfDelivery: null,
    active: true,
    partialPayment: 0,
  };

  editMode = false;

  currentPage = 'New Opportunity';
  constructor(public dialogRef: MatDialogRef<OpportunityCreateComponent>, private fb: FormBuilder,
              private oemService: OemService, private opportunityService: OpportunityService,
              private clientService: ClientService, private toast: HotToastService, public dialog: MatDialog,
              private staffService: StaffService,  @Inject(MAT_DIALOG_DATA) public info: {opportunityId: string}) {
                this.opportunityId = info.opportunityId;
              }

  ngOnInit(): void {
    this.initializeForm();
    this.getOptions();

    if (this.opportunityId) {
      this.form.disable();
      this.editMode = true;
      this.currentPage = 'Update Opportunity';
      this.opportunityService.getOpportunityForEdit(this.opportunityId)
      .pipe(untilDestroyed(this))
      .subscribe(
        data => {
          this.clientChange(data.clientId, data.clientContactId);

          this.form.patchValue({
            name: data.name,
            opportunityStageId: data.opportunityStageId,
            clientId: data.clientId,
            clientContactId: data.clientContactId,
            oemIds: data.oemIds,
            description: data.description,
            businessTypeId: data.businessTypeId,
            opportunityClassificationId: data.opportunityClassificationId,
            quantity: data.quantity,
            costPrice: data.costPrice,
            sellingPrice: data.sellingPrice,
            training: data.training,
            otherFees: this.data.otherFees,
            opportunityTeam: data.opportunityTeam,
            amountPaid: data.amountPaid,
            rate: data.rate,
            datePaymentReceived: data.datePaymentReceived,
            invoiceNumber: data.invoiceNumber,
            deliveryStatusId: data.deliveryStatusId,
            dateOfDelivery: data.dateOfDelivery,
            active: data.active,
            partialPayment: data.partialPayment
          });

          this.form.enable();
        }
      );
    }

    this.form.get('costPrice').valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());
    this.form.get('sellingPrice').valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());
    this.form.get('training').valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());
    this.form.get('otherFees').valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());
  }
  calculateMargin(): void {
    const costPrice = this.form.get('costPrice').value;
    const sellingPrice = this.form.get('sellingPrice').value;
    const training = this.form.get('training').value;
    const otherFees = this.form.get('otherFees').value;

    const invalidEntry = isNaN(costPrice) || isNaN(sellingPrice) || isNaN(training)
    || isNaN(otherFees);

    if (invalidEntry) {
      this.invalidateMargin();
      return;
    }

    const margin = (sellingPrice * 1) - ((costPrice * 1) + (training * 1) + (otherFees * 1));

    this.form.patchValue({
      margin: margin.toFixed(2)
    });
  }

  invalidateMargin(): void {
    this.form.patchValue({
      margin: 0
    });
  }

  getOptions(): void {
    this.clients$ = this.clientService.getClients();
    this.oems$ = this.oemService.getOems();
    this.stages$ = this.opportunityService.getStages();
    this.businessTypes$ = this.opportunityService.getBusinessTypes();
    this.classifications$ = this.opportunityService.getClassifications();
    this.staffs$ = this.staffService.getStaffs();
    this.deliveryStatuses$ = this.opportunityService.getDeliveryStatuses();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      name: [this.data.name, Validators.required],
      opportunityStageId: [this.data.opportunityStageId, [Validators.required, Validators.min(1)]],
      clientId: [this.data.clientId, Validators.required],
      clientContactId: [this.data.clientContactId, [Validators.required, Validators.min(1)]],
      oemIds: [this.data.oemIds, Validators.maxLength(2)],
      description: [this.data.description, Validators.required],
      businessTypeId: [this.data.businessTypeId, [Validators.required, Validators.min(1)]],
      opportunityClassificationId: [this.data.opportunityClassificationId, [Validators.required, Validators.min(1)]],
      quantity: [this.data.quantity, onlyNumberValidator],
      costPrice: [this.data.costPrice, onlyNumberValidator],
      sellingPrice: [this.data.sellingPrice, onlyNumberValidator],
      training: [this.data.training, onlyNumberValidator],
      otherFees: [this.data.otherFees, onlyNumberValidator],
      margin: [{value: 0, disabled: true}],
      opportunityTeam: [this.data.opportunityTeam],
      amountPaid: [this.data.amountPaid, onlyNumberValidator],
      rate: [this.data.rate, onlyNumberValidator],
      datePaymentReceived: [this.data.datePaymentReceived],
      invoiceNumber: [this.data.invoiceNumber],
      deliveryStatusId: [this.data.deliveryStatusId],
      dateOfDelivery: [this.data.dateOfDelivery],
      active: [this.data.active],
      partialPayment: [this.data.partialPayment]
    });
  }

  get f(): any { return this.form.controls; }

  returnToOpportunity(value?: string): void {
    this.dialogRef.close(value);
  }

  clientChange(clientId: string, contactId: number = 0): void {
    this.clientContacts$ = this.clientService.getClientContacts(clientId);
    this.f.clientContactId.patchValue(contactId);
  }

  submitOpportunity(): void {
    this.loading = true;

    if (this.editMode) {
      const request = {...this.data, ...this.form.value} as OpportunityUpdateRequest;
      request.opportunityId = this.opportunityId;
      this.opportunityService.updateOpportunity(request).pipe(untilDestroyed(this))
        .subscribe(
          () => {
            this.toast.success('Opportunity Updated');
            this.returnToOpportunity('Success');
          },
          (err: ErrorResponse) => {
            this.toast.error(err.message);
            this.loading = false;
          }
        );
      }

    if (!this.editMode) {
      const request = {...this.data, ...this.form.value} as OpportunityCreateRequest;

      this.opportunityService.createOpportunity(request).pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.toast.success('Opportunity Added');
          this.returnToOpportunity('Success');
        },
        (err: ErrorResponse) => {
          this.toast.error(err.message);
          this.loading = false;
        }
      );
    }
  }

  addClient(): void {
    const dialogRef = this.dialog.open(CreateClientComponent, { width: '400px' });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.f.clientId.patchValue(result);
        this.clients$ = this.clientService.getClients();
      }
    });
  }

  addClientContact(): void {
    const clientId = this.form.get('clientId').value;
    if (!clientId) {
      this.toast.warning('Select a Client');
      return;
    }
    const dialogRef = this.dialog.open(CreateClientContactComponent, {
      width: '400px',
      data: { clientId }
    });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        const clientContactId = +result;
        this.clientChange(clientId, clientContactId);
      }
    });

  }

  toggleOpportunityStatus(): void {
    if (this.form.controls['active'].value === true) {
      this.form.controls['active'].patchValue(false);
    } else {
      this.form.controls['active'].patchValue(true);
    }
  }
}

