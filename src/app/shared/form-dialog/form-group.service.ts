import { Injectable } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

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
    });

    return new UntypedFormGroup(group);
  }

}
