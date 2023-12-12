import { Component, OnInit } from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder,
  FormControl, FormGroup, ValidatorFn
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-margin-calculator',
  templateUrl: './margin-calculator.component.html',
  styleUrls: ['./margin-calculator.component.scss']
})
export class MarginCalculatorComponent implements OnInit {

  currentPage = 'Margin Calculator';

  form!: FormGroup;
  get f(): any { return this.form.controls; }

  witholdingTaxPercentCtrl = new FormControl(5);

  clientForeignCostCtrl = new FormControl(0, InvalidCharacterValidator());
  clientRateCtrl = new FormControl(0, InvalidCharacterValidator());
  clientLocalCostCtrl = new FormControl({value: 0, disabled: true});

  oemForeignCostCtrl = new FormControl(0, InvalidCharacterValidator());
  oemRateCtrl = new FormControl(0, InvalidCharacterValidator());
  oemLocalCostCtrl = new FormControl({value: 0, disabled: true});

  witholdingTaxForeignCostCtrl = new FormControl({value: 0, disabled: true});
  witholdingTaxRateCtrl = new FormControl({value: 0, disabled: true});
  witholdingTaxLocalCostCtrl = new FormControl({value: 0, disabled: true});

  prForeignCostCtrl = new FormControl(0, InvalidCharacterValidator());
  prRateCtrl = new FormControl(0, InvalidCharacterValidator());
  prLocalCostCtrl = new FormControl({value: 0, disabled: true});

  trainingForeignCostCtrl = new FormControl(0, InvalidCharacterValidator());
  trainingRateCtrl = new FormControl(0, InvalidCharacterValidator());
  trainingLocalCostCtrl = new FormControl({value: 0, disabled: true});

  marginFinalCtrl = new FormControl({value: 0, disabled: true});
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      otherCosts: this.fb.array([
        this.fb.control(0, InvalidCharacterValidator())
      ])
    });
    this.clientForeignCostCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());
    this.clientRateCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());

    this.oemForeignCostCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());
    this.oemRateCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());

    this.witholdingTaxForeignCostCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());
    this.witholdingTaxRateCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());

    this.prForeignCostCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());
    this.prRateCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());

    this.trainingForeignCostCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());
    this.trainingRateCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateMargin());
  }

  get otherCosts(): FormArray {
    return this.form.get('otherCosts') as FormArray;
  }

  calculateMargin(): void {
    const otherCosts = this.otherCosts.value as any[];
    const witholdingTaxPercent = this.witholdingTaxPercentCtrl.value!;

    const clientForeignCost = this.clientForeignCostCtrl.value!;
    const clientRate = this.clientRateCtrl.value!;

    const oemForeignCost = this.oemForeignCostCtrl.value!;
    const oemRate = this.oemRateCtrl.value!;

    const prForeignCost = this.prForeignCostCtrl.value!;
    const prRate = this.prRateCtrl.value!;

    const trainingForeignCost = this.trainingForeignCostCtrl.value!;
    const trainingRate = this.trainingRateCtrl.value!;

    const invalidEntry = isNaN(clientForeignCost) || isNaN(clientRate) || isNaN(oemForeignCost)
    || isNaN(oemRate) || isNaN(witholdingTaxPercent)
    || isNaN(prForeignCost) || isNaN(prRate) || isNaN(trainingForeignCost) || isNaN(trainingRate)
    || otherCosts.some(x => isNaN(x));

    if (invalidEntry) {
      this.invalidateMargin();
      return;
    }

    const witholdingTaxForeignCost = (clientForeignCost * witholdingTaxPercent) / 100; // this.witholdingTaxForeignCostCtrl.value;
    const witholdingTaxRate = clientRate;

    const clientLocalCost = clientForeignCost * clientRate;
    const oemLocalCost = oemForeignCost * oemRate;
    const witholdingTaxLocalCost = witholdingTaxForeignCost * witholdingTaxRate;
    const prLocalCost = prForeignCost * prRate;
    const traingLocalCost = trainingForeignCost * trainingRate;
    const marginFinal = clientLocalCost - (oemLocalCost + witholdingTaxLocalCost + prLocalCost + traingLocalCost);

    this.witholdingTaxForeignCostCtrl.setValue(Number(witholdingTaxForeignCost.toFixed(2)));
    this.witholdingTaxRateCtrl.setValue(witholdingTaxRate);
    this.clientLocalCostCtrl.setValue(Number(clientLocalCost.toFixed(2)));
    this.oemLocalCostCtrl.setValue(Number(oemLocalCost.toFixed(2)));
    this.witholdingTaxLocalCostCtrl.setValue(Number(witholdingTaxLocalCost.toFixed(2)));
    this.prLocalCostCtrl.setValue(Number(prLocalCost.toFixed(2)));
    this.trainingLocalCostCtrl.setValue(Number(traingLocalCost.toFixed(2)));
    this.marginFinalCtrl.setValue(Number(marginFinal.toFixed(2)));
  }

  addOtherControl(): void {
    this.otherCosts.push(new FormControl(0, InvalidCharacterValidator()));
  }

  removeOtherControl(index: number): void {
    this.otherCosts.removeAt(index);
  }

  invalidateMargin(): void {
    this.marginFinalCtrl.setValue(0);
  }

}

export function InvalidCharacterValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    return isNaN(control.value) ? {invalidNumber: {value: control.value}} : null;
  };
}
