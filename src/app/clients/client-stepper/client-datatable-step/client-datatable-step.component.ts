import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Datatables } from 'app/core/utils/datatables';
import { SettingsService } from 'app/settings/settings.service';
import * as _ from 'lodash';

@Component({
  selector: 'mifosx-client-datatable-step',
  templateUrl: './client-datatable-step.component.html',
  styleUrls: ['./client-datatable-step.component.scss']
})
export class ClientDatatableStepComponent implements OnInit {
  /** Input Fields Data */
  @Input() datatableData: any;
  /** Create Input Form */
  datatableForm: UntypedFormGroup;

  datatableInputs: any = [];
  datatableInputsCopy: any[];

  constructor(private formBuilder: UntypedFormBuilder,
    private settingsService: SettingsService,
    private datatableService: Datatables) { }

  ngOnInit(): void {
    this.datatableInputs = this.datatableService.filterSystemColumns(this.datatableData.columnHeaderData);
    const inputItems: any = {};
    this.datatableInputs.forEach((input: any) => {
      input.controlName = this.getInputName(input);
      if (!input.isColumnNullable) {
        if (this.isNumeric(input.columnDisplayType)) {
          inputItems[input.controlName] = new UntypedFormControl(0, [Validators.required]);
        } else {
          inputItems[input.controlName] = new UntypedFormControl('', [Validators.required]);
        }
      } else {
        inputItems[input.controlName] = new UntypedFormControl('');
      }
      if (this.isString(input.columnDisplayType)) {
        const columnLength = input.columnLength ? input.columnLength : 255;
        inputItems[input.controlName].addValidators([Validators.maxLength(columnLength)]);
      } else if (this.isNumeric(input.columnDisplayType)) {
        const columnLength = input.columnLength ? input.columnLength : 10;
        inputItems[input.controlName].addValidators([Validators.maxLength(columnLength), Validators.max(2147483647), this.maxLength(columnLength), Validators.min(0)]);
      }
    });
    this.datatableForm = this.formBuilder.group(inputItems);
    this.datatableInputsCopy = _.cloneDeep(this.datatableInputs);
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

  getInputName(datatableInput: any): string {
    return this.datatableService.getInputName(datatableInput);
  }

  isNumeric(columnType: string) {
    return this.datatableService.isNumeric(columnType);
  }

  isDate(columnType: string) {
    return this.datatableService.isDate(columnType);
  }

  isBoolean(columnType: string) {
    return this.datatableService.isBoolean(columnType);
  }

  isDropdown(columnType: string) {
    return this.datatableService.isDropdown(columnType);
  }

  isString(columnType: string) {
    return this.datatableService.isString(columnType);
  }

  isText(columnType: string) {
    return this.datatableService.isText(columnType);
  }

  get payload(): any {
    const dateFormat = this.settingsService.dateFormat;
    const datatableDataValues = this.datatableForm.value;

    const data = this.datatableService.buildPayload(this.datatableInputs, datatableDataValues, dateFormat,
      { locale: this.settingsService.language.code });

    return {
      registeredTableName: this.datatableData.registeredTableName,
      data: data
    };
  }

  isCamposClienteEmpresas() {
    return this.datatableData.registeredTableName === 'campos_cliente_empresas';
  }

  onSelectionChange(event: any) {
    if (this.isCamposClienteEmpresas()) {
      if (event.source.ngControl.name === 'Departamento') {
        const departmentoId: number = this.datatableForm.value.Departamento;
        for (const i in this.datatableInputsCopy) {
          if ('Ciudad_cd_Ciudad' === this.datatableInputsCopy[i].columnName) {
            const columOptions: any[] = this.datatableInputsCopy[i].columnValues;
            this.datatableInputs[i].columnValues = columOptions ? columOptions.filter(opt => opt.parentId === departmentoId) : [];
          }
        }
      }
      if (event.source.ngControl.name === 'Negocio') {
        const negocio = this.datatableForm.value.Negocio;
        for (const i in this.datatableInputsCopy) {
          if ('Negocio_cd_Negocio' === this.datatableInputs[i].columnName) {
            const columOptions: any[] = this.datatableInputs[i].columnValues;
            const columnValues  = columOptions ? columOptions.filter(opt => opt.id === negocio && opt.value === 'CONFIRMING') : [];
            if (columnValues && columnValues.length > 0) {
              this.datatableForm.get('NIT confirming').setValidators([Validators.required]);
            } else {
                this.datatableForm.get('NIT confirming').clearValidators();
            }
            this.datatableForm.get('NIT confirming').updateValueAndValidity();
          }
        }
      }
    }
  }
}
