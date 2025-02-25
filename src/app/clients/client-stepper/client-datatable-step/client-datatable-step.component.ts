import {Component, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Datatables} from 'app/core/utils/datatables';
import {SettingsService} from 'app/settings/settings.service';
import * as _ from 'lodash';
import {SystemService} from 'app/system/system.service';
import {GlobalConfiguration} from 'app/system/configurations/global-configurations-tab/configuration.model';

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

  cupoDefaultValue = '1';

  private decimalFields: string[] = ['Cupo', 'Cupo solicitado', 'Cupo aprobado', 'Cupo score'];

  constructor(
    private readonly systemService: SystemService,
    private readonly formBuilder: UntypedFormBuilder,
    private settingsService: SettingsService,
    private datatableService: Datatables) {
  }


  ngOnInit(): void {

    this.systemService.getConfigurationByName('client-creation-cupo-default-value').subscribe({
      next: (config: GlobalConfiguration) => {
        this.cupoDefaultValue = String(config.value);
        this.ngPostInit();
      },
      error: (err) => {
        console.error('Error whilst retrieving default value configuration:', err);
      }
    });

  }


  ngPostInit(): void {

    this.datatableInputs = this.datatableService.filterSystemColumns(this.datatableData.columnHeaderData);
    const inputItems: any = {};
    this.datatableInputs.forEach((input: any, index: number) => {
      if (this.decimalFields.includes(this.getInputName(input))) {
        this.datatableInputs[index] = {
          ...this.datatableInputs[index], // Keep existing properties
          columnDisplayType: 'STRING'                 // Update with new data
        };
      }
    });

    this.datatableInputs.forEach((input: any, index: number) => {
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

      if (this.decimalFields.includes(input.controlName)) {
        const columnLength = input.columnLength ? input.columnLength : 10;
        inputItems[input.controlName].setValidators([this.maxLengthWithoutDots(columnLength)]);
        if (!input.isColumnNullable) {
          inputItems[input.controlName].addValidators([Validators.required]);
        }
        inputItems[input.controlName].updateValueAndValidity();
        this.addDecimalListener(inputItems[input.controlName], columnLength);
      }

      if (this.isString(input.columnDisplayType) && !this.decimalFields.includes(input.controlName)) {
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
        this.addNumericLengthListener(inputItems[input.controlName], columnLength);

      }

      // Set default values
      if (input.controlName === 'Cupo' || input.controlName === 'Cupo otros prestamos'
        || input.controlName === 'Cupo aprobado' || input.controlName === 'Cupo solicitado') {
        inputItems[input.controlName].setValue(this.cupoDefaultValue);
        inputItems[input.controlName].updateValueAndValidity();

      } else if (input.controlName === 'Fecha Cupo') {
        inputItems[input.controlName].setValue(new Date());
        inputItems[input.controlName].updateValueAndValidity();
      }

    });
    this.datatableForm = this.formBuilder.group(inputItems);
    this.datatableInputsCopy = _.cloneDeep(this.datatableInputs);
  }

  private addStringLengthListener(control: AbstractControl, maxLength: number): void {
    control.valueChanges.subscribe(value => {
      if (value && value.length > maxLength) {
        control.setValue(value.slice(0, maxLength), {emitEvent: false});
      }
    });
  }

  private addNumericLengthListener(control: AbstractControl, maxLength: number): void {
    control.valueChanges.subscribe(value => {
      if (value !== null && value !== '') {
        const strValue = value.toString();
        if (strValue.length > maxLength) {
          control.setValue(Number(strValue.slice(0, maxLength)), {emitEvent: false});
        }
      }
    });
  }

  private formatNumber(value: string): string {
    // Split the value into integer and decimal parts
    let [integerPart, decimalPart] = value.split('.');

    // Add periods to the integer part (thousands separator)
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // If there's a decimal part, return it along with the formatted integer part
    if (decimalPart !== undefined) {
      return integerPart + ',' + decimalPart; // Use comma for decimal separator
    } else {
      return integerPart; // Return only the formatted integer part if there's no decimal
    }
  }

  private addDecimalListener(control: AbstractControl, maxLength: number): void {
    let isProgrammaticChange = false;  // Flag to prevent recursion

    control.valueChanges.subscribe(value => {
      if (isProgrammaticChange || !value) {
        return;
      }

      // Remove existing commas to avoid formatting an already formatted value
      const cleanValue = value.toString().replace(/\./g, '').replace(',', '.');


      if (!isNaN(cleanValue)) {
        // Format the value
        const formattedValue = this.formatNumber(cleanValue.slice(0, maxLength));

        if (formattedValue !== value) {
          // Prevent re-triggering the same value change
          isProgrammaticChange = true;
          control.setValue(formattedValue, {emitEvent: false});
          isProgrammaticChange = false;
        }
      } else {
        value = value.replace(/[^0-9]/g, '');
        const formattedValue = this.formatNumber(value.slice(0, maxLength));
        isProgrammaticChange = true;
        control.setValue(formattedValue, {emitEvent: false});
        isProgrammaticChange = false;
      }
    });
  }

  private maxLengthWithoutDots(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value ? control.value.replace(/\./g, '') : '';
      return value.length > maxLength ? {
        maxLengthWithoutDots: {
          requiredLength: maxLength,
          actualLength: value.length
        }
      } : null;
    };
  }

  private parseFormattedNumber(value: string): number {
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    return Number(cleanValue);
  }


  maxLength(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const val = control.value;
      if (val && val.toString().length > max) {
        return {'maxLength': {value: val}};
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
    const datatableDataValues = {...this.datatableForm.value};

    // Convert formatted numbers back to actual numbers for the payload
    this.decimalFields.forEach(fieldName => {
      if (datatableDataValues[fieldName]) {
        datatableDataValues[fieldName] = this.parseFormattedNumber(datatableDataValues[fieldName]);
      }
    });

    const data = this.datatableService.buildPayload(this.datatableInputs, datatableDataValues, dateFormat,
      {locale: this.settingsService.language.code});


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
            const columnValues = columOptions ? columOptions.filter(opt => opt.id === negocio && opt.value === 'CONFIRMING') : [];
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
