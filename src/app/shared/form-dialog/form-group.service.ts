import { Injectable } from '@angular/core';
import {AbstractControl, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators} from '@angular/forms';

import { FormfieldBase } from './formfield/model/formfield-base';

@Injectable({
  providedIn: 'root'
})
export class FormGroupService {

  constructor() { }

  createFormGroup(formfields: FormfieldBase[]) {
    const group: any = {};
    formfields.forEach(formfield => {
      if (formfield.required) {
        group[formfield.controlName] = new UntypedFormControl(formfield.value, [Validators.required, Validators.maxLength(formfield.controlLength)]);
      } else {
        group[formfield.controlName] = new UntypedFormControl(formfield.value, Validators.maxLength(formfield.controlLength));
      }
      if ('number' === formfield.type) {
        group[formfield.controlName].addValidators([Validators.max(2147483647), this.maxLength(10), Validators.min(0)]);
      }
    });
    return new UntypedFormGroup(group);
  }

  maxLength(max: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const val = control.value;
      if (val && val.toString().length > max) {
        return { 'maxLength': {value: val} };
      }
      return null;
    };
  }

}
