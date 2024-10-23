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

  private decimalFields: string[] = ['Cupo', 'Cupo solicitado', 'Cupo aprobado', 'Cupo score'];

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
          this.addStringLengthListener(inputItems[input.controlName], columnLength);
        } else if (this.isNumeric(input.columnDisplayType)) {
          const columnLength = input.columnLength ? input.columnLength : 10;
          inputItems[input.controlName].addValidators([
            Validators.max(2147483647),
            this.maxLength(columnLength),
            Validators.min(0)
          ]);
          
          // Check if this field needs decimal formatting
          if (this.decimalFields.includes(input.controlName)) {
            this.addDecimalListener(inputItems[input.controlName]);
          } else {
            this.addNumericLengthListener(inputItems[input.controlName], columnLength);
          }
        }
      });
      this.datatableForm = this.formBuilder.group(inputItems);
      this.datatableInputsCopy = _.cloneDeep(this.datatableInputs);
    }

  private addStringLengthListener(control: AbstractControl, maxLength: number): void {
    control.valueChanges.subscribe(value => {
      if (value && value.length > maxLength) {
        control.setValue(value.slice(0, maxLength), { emitEvent: false });
      }
    });
  }

  private addNumericLengthListener(control: AbstractControl, maxLength: number): void {
    control.valueChanges.subscribe(value => {
      if (value !== null && value !== '') {
        const strValue = value.toString();
        if (strValue.length > maxLength) {
          control.setValue(Number(strValue.slice(0, maxLength)), { emitEvent: false });
        }
      }
    });
  }

  private formatNumber(value: string): string {
    let cleanValue = value.replace(/[^\d.]/g, '');
    
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }

    if (!cleanValue.includes('.')) {
      return this.addThousandsSeparator(cleanValue);
    }

    const [integerPart, decimalPart] = cleanValue.split('.');
    return this.addThousandsSeparator(integerPart) + '.' + decimalPart;
  }

  private addThousandsSeparator(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  private parseFormattedNumber(value: string): number {
    const parts = value.split('.');
    if (parts.length <= 1) return Number(value.replace(/\./g, ''));
    
    const integerPart = parts.slice(0, -1).join('').replace(/\./g, '');
    const decimalPart = parts[parts.length - 1];
    return Number(`${integerPart}.${decimalPart}`);
  }

  private addDecimalListener(control: AbstractControl): void {
    let previousValue = '';
    
    control.valueChanges.subscribe(value => {
      if (value === null || value === '') {
        previousValue = '';
        return;
      }

      const stringValue = value.toString();
      if (stringValue === previousValue) {
        return;
      }

      const formattedValue = this.formatNumber(stringValue);
      previousValue = formattedValue;


      control.setValue(formattedValue, { emitEvent: false });
    });
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
    const datatableDataValues = { ...this.datatableForm.value };

    this.decimalFields.forEach(fieldName => {
      if (datatableDataValues[fieldName]) {
        datatableDataValues[fieldName] = this.parseFormattedNumber(datatableDataValues[fieldName]);
      }
    });

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
