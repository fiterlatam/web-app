import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

/** Custom Services */
import { ClientsalliesService } from '../clientsallies.service';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-create-clientally',
  templateUrl: './create-clientally.component.html',
  styleUrls: ['./create-clientally.component.scss']
})


export class CreateClientallyComponent implements OnInit {
  groupForm: UntypedFormGroup;

  // Template data
  departmentsList: any;
  citiesList: any;
  liquidationFrequencyList: any;
  bankEntitiesList: any;
  accountTypesList: any;
  taxProfilesList: any;
  statesList: any;
  dataValue = 1234567890;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private clientsalliesService: ClientsalliesService,
              private settingsService: SettingsService,
              private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.createGroupForm();
    this.loadClientalliesTemplate('ngOnInit');
  }

  createGroupForm() {
    this.groupForm = this.formBuilder.group({
      'companyName': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      'nit': ['', [Validators.required, Validators.maxLength(20), Validators.minLength(1)]],
      'nitDigit': ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      'address': ['', [Validators.required, Validators.maxLength(40)]],
      'departmentCodeValueId': ['', [Validators.required]],
      'cityCodeValueId': ['', [Validators.required]],
      'liquidationFrequencyCodeValueId': ['', [Validators.required]],
      'applyCupoMaxSell': [false],
      'cupoMaxSell': ['', [Validators.pattern('^[0-9,\\.]+$'), Validators.min(1), Validators.max(2147483647)]],
      'settledComission': ['', [Validators.pattern('^[0-9,\\.]+$'), Validators.min(0), Validators.maxLength(5), Validators.max(99.99)]],
      'buyEnabled': [false],
      'collectionEnabled': [false],
      'bankEntityCodeValueId': [''],
      'accountTypeCodeValueId': [''],
      'accountNumber': ['', [Validators.maxLength(20)]],
      'taxProfileCodeValueId': [''],
      'stateCodeValueId': [''],
    });
    this.groupForm.updateValueAndValidity();
    this.enableOrDisableCupoMaxSellField(false);
  }

  loadClientalliesTemplate(requestFrom: String) {
    this.clientsalliesService.getTemplate().subscribe(( apiResponseBody: any ) => {
      this.departmentsList = apiResponseBody.departmentsList;
      this.liquidationFrequencyList = apiResponseBody.liquidationFrequencyList;
      this.bankEntitiesList = apiResponseBody.bankEntitiesList;
      this.accountTypesList = apiResponseBody.accountTypesList;
      this.taxProfilesList = apiResponseBody.taxProfilesList;
      this.statesList = apiResponseBody.statesList;

    });
  }

  loadCitiesByDepartment(id: any) {
    console.log('loadCitiesByDepartment called with id:' + id);
    this.clientsalliesService.getCitiesByDepartment(id).subscribe(( apiResponseBody: any ) => {
      console.log(apiResponseBody);
      this.citiesList = apiResponseBody.citiesList;
    });
  }


  submit() {
    const groupFormData = this.groupForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    if (typeof groupFormData.accountNumber === 'string') {
      groupFormData.accountNumber = groupFormData.accountNumber.replace(/\D/g, '');
      this.groupForm.get('accountNumber').patchValue(groupFormData.accountNumber);
    }
    if (typeof groupFormData.cupoMaxSell === 'string') {
      groupFormData.cupoMaxSell = groupFormData.cupoMaxSell.replace(/\D/g, '');
      this.groupForm.get('cupoMaxSell').patchValue(groupFormData.cupoMaxSell);
    }
    this.groupForm.updateValueAndValidity();
    if (this.groupForm.invalid) {
      return;
    }
    const data = {
      ...groupFormData,
      dateFormat,
      locale
    };

    this.clientsalliesService.createClientsallies(data).subscribe((response: any) => {
      this.router.navigate(['../clientsallies']);
    });
  }

  reloadCitiesByDepartment(id: any) {
    this.loadCitiesByDepartment(id);
  }

  enableOrDisableCupoMaxSellField(selected: boolean) {
    if (selected) {
      this.groupForm.get('cupoMaxSell').enable();
      this.groupForm.get('cupoMaxSell').addValidators(Validators.required);
      this.groupForm.get('cupoMaxSell').updateValueAndValidity();
    } else {
      this.groupForm.get('cupoMaxSell').patchValue('');
      this.groupForm.get('cupoMaxSell').disable();
    }
  }
}
