import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Datatables } from 'app/core/utils/datatables';
import { SettingsService } from 'app/settings/settings.service';
import * as _ from "lodash";
import {FormfieldBase} from "../../../shared/form-dialog/formfield/model/formfield-base";

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
    });
    this.datatableForm = this.formBuilder.group(inputItems);
    this.datatableInputsCopy = _.cloneDeep(this.datatableInputs);
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
  filterCityBySelectedDepartmento(event: any) {
    if (event.source.ngControl.name == 'Departamento') {
      const departmentoId: number = this.datatableForm.value.Departamento;
      for (let i in this.datatableInputsCopy) {
        if ('Ciudad_cd_Ciudad' == this.datatableInputsCopy[i].columnName) {
          const columOptions: any[] = this.datatableInputsCopy[i].columnValues;
          this.datatableInputs[i].columnValues = columOptions ? columOptions.filter(opt => opt.parentId === departmentoId) : [];
        }
      }
    }
  }

}
