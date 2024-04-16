import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';

import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';

/** rxjs Imports */
import { merge } from 'rxjs';
import { tap, startWith, map, distinctUntilChanged, debounceTime} from 'rxjs/operators';

/** Custom Services */
import { ClientsalliesService } from '../clientsallies.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';

@Component({
  selector: 'mifosx-create-clientally',
  templateUrl: './create-clientally.component.html',
  styleUrls: ['./create-clientally.component.scss']
})


export class CreateClientallyComponent implements OnInit {

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
      private clientsalliesService: ClientsalliesService,
      private dateUtils: Dates,
      private settingsService: SettingsService,
      private formBuilder: UntypedFormBuilder) {

    console.log("constructor");
  }


  ngOnInit(): void {
    console.log("ngOnInit");
    this.createGroupForm();
    this.loadClientalliesTemplate("ngOnInit");
  }


  createGroupForm() {
    this.groupForm = this.formBuilder.group({
      'companyName': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      'nit': ['', [Validators.required, Validators.maxLength(15), Validators.minLength(15)]],
      'nitDigit': ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      'address': ['', [Validators.required, Validators.maxLength(40)]],
      'departmentCodeValueId': ['', [Validators.required]],
      'cityCodeValueId': ['', [Validators.required]],
      'liquidationFrequencyCodeValueId': ['', [Validators.required]],
      'applyCupoMaxSell': [false],
      'cupoMaxSell': ['', [Validators.pattern('^[0-9]+$')]],
      'settledComission': ['', [Validators.pattern('^[0-9]+$')]],
      'buyEnabled': [false],
      'collectionEnabled': [false],
      'bankEntityCodeValueId': [''],
      'accountTypeCodeValueId': [''],
      'accountNumber': ['', [Validators.pattern('^[0-9]+$')]],
      'taxProfileCodeValueId': [''],
      'stateCodeValueId': [''],
    });
    this.groupForm.updateValueAndValidity();

    this.enableOrDisableCupoMaxSellField(false);

  }


  loadClientalliesTemplate(requestFrom: String) {
    console.log("clientsallies " + requestFrom);

    this.clientsalliesService.getTemplate().subscribe(( apiResponseBody: any ) => {
      console.log(apiResponseBody);

      this.departmentsList = apiResponseBody.departmentsList;
      this.liquidationFrequencyList = apiResponseBody.liquidationFrequencyList;
      this.bankEntitiesList = apiResponseBody.bankEntitiesList;
      this.accountTypesList = apiResponseBody.accountTypesList;
      this.taxProfilesList = apiResponseBody.taxProfilesList;
      this.statesList = apiResponseBody.statesList;

    });
  }

  loadCitiesByDepartment(id: any) {
    console.log("loadCitiesByDepartment called with id:" + id);
    this.clientsalliesService.getCitiesByDepartment(id).subscribe(( apiResponseBody: any ) => {
      console.log(apiResponseBody);
      this.citiesList = apiResponseBody.citiesList;
    });
  }


  submit() {
    const groupFormData = this.groupForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
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
    if(selected) {
      this.groupForm.get("cupoMaxSell").enable();
    } else {
      this.groupForm.get("cupoMaxSell").patchValue("");
      this.groupForm.get("cupoMaxSell").disable();
    }
  }
}
