import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {FormfieldBase} from './model/formfield-base';
import * as _ from "lodash";

@Component({
  selector: 'mifosx-formfield',
  templateUrl: './formfield.component.html',
  styleUrls: ['./formfield.component.scss']
})
export class FormfieldComponent implements OnInit {

  @Input() form: UntypedFormGroup;
  @Input() formfield: FormfieldBase;
  @Input() formfields: FormfieldBase[];
  formfieldsCopy: FormfieldBase[];

  constructor() {
  }

  filterCityBySelectedDepartmento(event: any) {
    if (event.source.ngControl.name == 'Departamento_cd_Departamento') {
      const departmentoCdId: number = this.form.value.Departamento_cd_Departamento;
      for (let i in this.formfieldsCopy as FormfieldBase[]) {
        if ('Ciudad_cd_Ciudad' == this.formfieldsCopy[i].controlName) {
          const dataOptions: any[] = this.formfieldsCopy[i].options.data;
          this.formfields[i].options.data = dataOptions ? dataOptions.filter(opt => opt.parentId === departmentoCdId) : [];
        }
      }
    }
  }

  ngOnInit() {
    this.formfieldsCopy = _.cloneDeep(this.formfields);
  }

}
