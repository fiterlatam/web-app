import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormGroup, Validators} from '@angular/forms';

import {FormfieldBase} from './model/formfield-base';
import * as _ from 'lodash';

@Component({
  selector: 'mifosx-formfield',
  templateUrl: './formfield.component.html',
  styleUrls: ['./formfield.component.scss']
})
export class FormfieldComponent implements OnInit {

  @Input() form: UntypedFormGroup;
  @Input() formfield: FormfieldBase;
  @Input() formfields: FormfieldBase[];
  @Input() datatableName: string;
  formfieldsCopy: FormfieldBase[];

  constructor() {
  }
  ngOnInit() {
    this.formfieldsCopy = _.cloneDeep(this.formfields);
  }

  isCamposClienteEmpresas() {
    return this.datatableName === 'campos_cliente_empresas';
  }
  onSelectionChange(event: any) {
    if (this.isCamposClienteEmpresas()) {
      if (event.source.ngControl.name === 'Departamento_cd_Departamento') {
        const departmentoId: number = this.form.value.Departamento_cd_Departamento;
        for (const i in this.formfieldsCopy as FormfieldBase[]) {
          if ('Ciudad_cd_Ciudad' === this.formfieldsCopy[i].controlName) {
            const dataOptions: any[] = this.formfieldsCopy[i].options.data;
            this.formfields[i].options.data = dataOptions ? dataOptions.filter(opt => opt.parentId === departmentoId) : [];
          }
        }
      }
      if (event.source.ngControl.name === 'Negocio_cd_Negocio') {
        const negocio = this.form.value.Negocio_cd_Negocio;
        for (const i in this.formfields as FormfieldBase[]) {
          if ('Negocio_cd_Negocio' === this.formfields[i].controlName) {
            const columOptions: any[] = this.formfields[i].options.data;
            const columnValues  = columOptions ? columOptions.filter(opt => opt.id === negocio && opt.value === 'CONFIRMING') : [];
            for (const item of this.formfields) {
                if (item.controlName === 'NIT confirming') {
                  item.required = columnValues && columnValues.length > 0;
                  if (columnValues && columnValues.length > 0) {
                    this.form.get('NIT confirming').setValidators([Validators.required]);
                  } else {
                    this.form.get('NIT confirming').clearValidators();
                  }
                }
            }
          }
        }
      }
    }
  }

}
