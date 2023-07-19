import { AbstractControl, ValidationErrors } from '@angular/forms';

export function onlyNumberValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const valid = /^-?\d*(\.\d+)?$/.test(control.value);
  return valid
    ? null
    : { invalidNumber: { valid: false, value: control.value } };
}

export function scoreValidator(control: AbstractControl): ValidationErrors | null {
  if (null) {
    let valid = /^[9]*$/.test(control.value);
    return valid ? null : {invalidNumber: { value: control.value}}
  } else {
    let valid = /^[0-3]*$/.test(control.value);
    return valid ? null : {invalidNumber: { value: control.value}}
  }
}
