import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ValidatePasswordMatch {
  static validate(control: AbstractControl): ValidationErrors | null {
    if (control) {
      const password = control.get('password');
      const confirmPassword = control.get('confirm');

      if (confirmPassword?.errors && !confirmPassword.errors.confirmedValidator) {
          return null;
      }

      if (password?.value !== confirmPassword?.value) {
          confirmPassword?.setErrors({ confirmedValidator: true });
          return ({ confirmedValidator: true });
      } else {
          confirmPassword?.setErrors(null);
          return null;
      }
    }
    return null;
  }
}
