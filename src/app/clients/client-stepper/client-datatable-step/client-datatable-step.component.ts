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
  datatableForm: UntypedFormGroup = this.formBuilder.group({});

  datatableInputs: any = [];
  datatableInputsCopy: any[];

  cupoDefaultValue = '1';

  private decimalFields: string[] = ['Cupo', 'Cupo solicitado', 'Cupo aprobado', 'Cupo score'];

  constructor(
    private readonly systemService: SystemService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly settingsService: SettingsService,
    private readonly datatableService: Datatables) {
  }

  ngOnInit(): void {
    if (!this.datatableData) {
      console.error('datatableData is required but not provided');
      return;
    }

    this.systemService.getConfigurationByName('client-creation-cupo-default-value').subscribe({
      next: (config: GlobalConfiguration) => {
        this.cupoDefaultValue = String(config.value);
        this.initializeForm();
      },
      error: (err) => {
        console.error('Error whilst retrieving default value configuration:', err);
        // Still initialize the form even if we can't get the default value
        this.initializeForm();
      }
    });
  }

  private initializeForm(): void {
    if (this.datatableData && this.datatableData.columnHeaderData) {
      this.datatableInputs = this.datatableService.filterSystemColumns(this.datatableData.columnHeaderData);
      this.updateDecimalFieldTypes();
      const inputItems = this.createFormControls();
      this.datatableForm = this.formBuilder.group(inputItems);
      this.datatableInputsCopy = _.cloneDeep(this.datatableInputs);
    }
  }

  private updateDecimalFieldTypes(): void {
    this.datatableInputs.forEach((input: any) => {
      if (this.decimalFields.includes(this.getInputName(input))) {
        input.columnDisplayType = 'STRING';
      }
    });
  }

  private createFormControl(input: any): UntypedFormControl {
    this.getInputName(input);
    const initialValue = !input.isColumnNullable && this.isNumeric(input.columnDisplayType) ? 0 : '';
    const control = new UntypedFormControl(initialValue);

    if (!input.isColumnNullable) {
      control.setValidators(Validators.required);
    }

    return control;
  }

  private createFormControls(): { [key: string]: UntypedFormControl } {
    const inputItems: { [key: string]: UntypedFormControl } = {};

    this.datatableInputs.forEach((input: any) => {
      const controlName = input.controlName || this.getInputName(input);
      input.controlName = controlName; // Ensure controlName is set
      const control = this.createFormControl(input);

      this.applyValidators(control, input);
      this.setDefaultValue(control, controlName);

      inputItems[controlName] = control;
    });

    return inputItems;
  }

  private applyValidators(control: UntypedFormControl, input: any): void {
    const controlName = this.getInputName(input);
    const columnLength = input.columnLength || (this.isNumeric(input.columnDisplayType) ? 10 : 255);

    if (this.decimalFields.includes(controlName)) {
      this.applyDecimalValidators(control, input, columnLength);
    } else if (this.isString(input.columnDisplayType)) {
      this.applyStringValidators(control, columnLength);
    } else if (this.isNumeric(input.columnDisplayType)) {
      this.applyNumericValidators(control, columnLength);
    }
  }

  private applyDecimalValidators(control: UntypedFormControl, input: any, columnLength: number): void {
    control.setValidators([this.maxLengthWithoutDots(columnLength)]);
    if (!input.isColumnNullable) {
      control.addValidators(Validators.required);
    }
    this.addDecimalListener(control, columnLength);
  }

  private applyStringValidators(control: UntypedFormControl, columnLength: number): void {
    control.addValidators(Validators.maxLength(columnLength));
    this.addStringLengthListener(control, columnLength);
  }

  private applyNumericValidators(control: UntypedFormControl, columnLength: number): void {
    control.addValidators([
      Validators.max(2147483647),
      this.maxLength(columnLength),
      Validators.min(0)
    ]);
    this.addNumericLengthListener(control, columnLength);
  }

  private setDefaultValue(control: UntypedFormControl, controlName: string): void {
    const cupoFields = ['Cupo', 'Cupo otros prestamos', 'Cupo aprobado', 'Cupo solicitado'];

    if (cupoFields.includes(controlName)) {
      control.setValue(this.cupoDefaultValue);
    } else if (controlName === 'Fecha Cupo') {
      control.setValue(new Date());
    }

    control.updateValueAndValidity();
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
    const [integerDerivedPart, decimalPart] = value.split('.');

    // Add periods to the integer part (thousands separator)
    const integerPart = integerDerivedPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

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
    const formData = this.datatableForm.value;
    const data: any = {
      registeredTableName: this.datatableData.registeredTableName,
      data: {}
    };

    Object.keys(formData).forEach(key => {
      let value = formData[key];

      // Handle decimal fields
      if (this.decimalFields.includes(key) && value) {
        value = this.parseFormattedNumber(value);
      }

      // Handle date fields
      if (value instanceof Date) {
        value = value.toISOString().slice(0, 10);
      }

      data.data[key] = value;
    });

    return data;
  }

  isCamposClienteEmpresas() {
    return this.datatableData.registeredTableName === 'campos_cliente_empresas';
  }

  onSelectionChange(event: any) {
    try {
      if (this.isCamposClienteEmpresas()) {
        if (event?.source?.ngControl?.name === 'Departamento') {
          const departmentoId: number = this.datatableForm?.value?.Departamento;
          if (departmentoId) {
            for (const i in this.datatableInputsCopy) {
              if ('Ciudad_cd_Ciudad' === this.datatableInputsCopy[i].columnName) {
                const columOptions: any[] = this.datatableInputsCopy[i].columnValues;
                this.datatableInputs[i].columnValues = columOptions ? columOptions.filter(opt => opt.parentId === departmentoId) : [];
              }
            }
          }
        }
        if (event?.source?.ngControl?.name === 'Negocio') {
          const negocio = this.datatableForm?.value?.Negocio;
          if (negocio) {
            for (const i in this.datatableInputsCopy) {
              if ('Negocio_cd_Negocio' === this.datatableInputs[i].columnName) {
                const columOptions: any[] = this.datatableInputs[i].columnValues;
                const columnValues = columOptions ? columOptions.filter(opt => opt.id === negocio && opt.value === 'CONFIRMING') : [];
                const nitControl = this.getFormControl('NIT confirming');
                if (nitControl) {
                  if (columnValues && columnValues.length > 0) {
                    nitControl.setValidators([Validators.required]);
                  } else {
                    nitControl.clearValidators();
                  }
                  nitControl.updateValueAndValidity();
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in onSelectionChange:', error);
    }
  }

  getFormControl(controlName: string): UntypedFormControl {
    return this.datatableForm.get(controlName) as UntypedFormControl;
  }
}
