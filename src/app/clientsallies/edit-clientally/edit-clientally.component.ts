import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

/** Custom Services */
import { ClientsalliesService } from '../clientsallies.service';
import { SettingsService } from 'app/settings/settings.service';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'mifosx-edit-clientally',
  templateUrl: './edit-clientally.component.html',
  styleUrls: ['./edit-clientally.component.scss']
})

export class EditClientallyComponent implements OnInit {

  entityId: any;
  apiData: any;

  groupForm: UntypedFormGroup;

  // Template data
  departmentsList: any;
  citiesList: any;
  liquidationFrequencyList: any;
  bankEntitiesList: any;
  accountTypesList: any;
  taxProfilesList: any;
  statesList: any;


  constructor(private route: ActivatedRoute,
      private router: Router,
      private decimalPipe: DecimalPipe,
      private clientsalliesService: ClientsalliesService,
      private settingsService: SettingsService,
      private formBuilder: UntypedFormBuilder) {

  }


  ngOnInit(): void {

    // this.el.nativeElement.applyCupoMaxSell = true;

    this.entityId = this.route.snapshot.params['id'];
    this.createGroupForm();

    this.clientsalliesService.getClientallyById(this.entityId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
     

      this.loadClientalliesTemplate('ngOnInit');
      this.loadCitiesByDepartment(apiResponseBody.departmentCodeValueId);
      this.patchValues();
    });
  }


  patchValues() {
    const locale = this.settingsService.language.code;
    const format = `1.${0}-${0}`;
    let accountNumber = this.apiData.accountNumber;
    if (accountNumber) {
      const inputVal = accountNumber.toString().replace(/\D/g, '');
      // accountNumber = this.decimalPipe.transform(inputVal, format, locale);
    }
    let cupoMaxSell = this.apiData.cupoMaxSell;
    if (cupoMaxSell) {
      const inputVal = cupoMaxSell.toString().replace(/\D/g, '');
      cupoMaxSell = this.decimalPipe.transform(inputVal, format, locale);
    }
    let settledComission = this.apiData.settledComission;
    if (settledComission) {
      const decimals = this.settingsService.decimals;
      const decimalFormat = `1.${decimals}-${decimals}`;
      settledComission = this.decimalPipe.transform(settledComission, decimalFormat, locale);
    }
    this.groupForm.patchValue({
      'companyName': this.apiData.companyName,
      'nit': this.apiData.nit,
      'nitDigit': this.apiData.nitDigit,
      'address': this.apiData.address,
      'departmentCodeValueId': this.apiData.departmentCodeValueId,
      'cityCodeValueId': this.apiData.cityCodeValueId,
      'liquidationFrequencyCodeValueId': this.apiData.liquidationFrequencyCodeValueId,
      'applyCupoMaxSell': this.apiData.applyCupoMaxSell,
      'cupoMaxSell': cupoMaxSell,
      'settledComission': settledComission,
      'buyEnabled': this.apiData.buyEnabled,
      'collectionEnabled': this.apiData.collectionEnabled,
      'bankEntityCodeValueId': this.apiData.bankEntityCodeValueId,
      'accountTypeCodeValueId': this.apiData.accountTypeCodeValueId,
      'accountNumber': this.apiData.accountNumber,
      'taxProfileCodeValueId': this.apiData.taxProfileCodeValueId,
      'stateCodeValueId': this.apiData.stateCodeValueId,
      });

      this.enableOrDisableCupoMaxSellField(this.apiData.applyCupoMaxSell);

  }

  patchCity() {
    this.groupForm.patchValue({
      'cityCodeValueId': this.apiData.cityCodeValueId,
      });
  }

  createGroupForm() {
    this.groupForm = this.formBuilder.group({
      'companyName': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      'nit': ['', [Validators.required, Validators.maxLength(20), Validators.minLength(1)]],
      'nitDigit': ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      'address': ['', [Validators.required, Validators.maxLength(100)]],
      'departmentCodeValueId': ['', [Validators.required]],
      'cityCodeValueId': ['', [Validators.required]],
      'liquidationFrequencyCodeValueId': ['', [Validators.required]],
      'applyCupoMaxSell': [false],
      'cupoMaxSell': [{value: ''}, [Validators.pattern('^[0-9,\\.]+$'),  Validators.min(1), Validators.max(2147483647)]],
      'settledComission': ['', [Validators.pattern('^[0-9,\\.]+$'), Validators.min(0), Validators.maxLength(5), Validators.max(99.99)]],
      'buyEnabled': [false],
      'collectionEnabled': [false],
      'bankEntityCodeValueId': [''],
      'accountTypeCodeValueId': [''],
      'accountNumber': ['', [Validators.pattern('^[0-9,\\.]+$'), Validators.maxLength(20)]],
      'taxProfileCodeValueId': [''],
      'stateCodeValueId': [''],
    });
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
    this.clientsalliesService.getCitiesByDepartment(id).subscribe(( apiResponseBody: any ) => {
      this.citiesList = apiResponseBody.citiesList;

      this.patchCity();

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

    this.clientsalliesService.editClientsallies(data, this.entityId).subscribe((response: any) => {
      this.router.navigate(['../clientsallies']);
    });

  }

  reloadCitiesByDepartment(id: any) {
    this.loadCitiesByDepartment(id);
  }

  enableOrDisableCupoMaxSellField(selected: boolean) {
    if (selected) {
      this.groupForm.get('cupoMaxSell').enable();
    } else {
      this.groupForm.get('cupoMaxSell').patchValue('');
      this.groupForm.get('cupoMaxSell').disable();
    }
  }
}
