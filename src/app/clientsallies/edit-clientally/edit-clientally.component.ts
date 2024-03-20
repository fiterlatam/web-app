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
  selector: 'mifosx-edit-clientally',
  templateUrl: './edit-clientally.component.html',
  styleUrls: ['./edit-clientally.component.scss']
})

export class EditClientallyComponent implements OnInit {

  entityId: any;
  apiData: any;

  groupForm: UntypedFormGroup;

  applyCupoMaxSellChkBox = false;

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

    this.entityId = this.route.snapshot.params["id"];

    console.log("ngOnInit");
    this.createGroupForm();

    this.clientsalliesService.getClientallyById(this.entityId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
      console.log("id: " + this.entityId);
      console.log(apiResponseBody);

      this.loadClientalliesTemplate("ngOnInit");
      this.loadCitiesByDepartment(apiResponseBody.departmentCodeValueId);
      this.patchValues();

      this.applyCupoMaxSellChkBox = apiResponseBody.applyCupoMaxSell;
    });  
  }


  patchValues() {
    this.groupForm.patchValue({
      'companyName': this.apiData.companyName,
      'nit': this.apiData.nit,
      'nitDigit': this.apiData.nitDigit,
      'address': this.apiData.address,
      'departmentCodeValueId': this.apiData.departmentCodeValueId,
      'cityCodeValueId': this.apiData.cityCodeValueId,
      'liquidationFrequencyCodeValueId': this.apiData.liquidationFrequencyCodeValueId,
      'applyCupoMaxSell': this.apiData.applyCupoMaxSell,
      'cupoMaxSell': this.apiData.cupoMaxSell,
      'settledComission': this.apiData.settledComission,
      'buyEnabled': this.apiData.buyEnabled,
      'collectionEnabled': this.apiData.collectionEnabled,
      'bankEntityCodeValueId': this.apiData.bankEntityCodeValueId,
      'accountTypeCodeValueId': this.apiData.accountTypeCodeValueId,
      'accountNumber': this.apiData.accountNumber,
      'taxProfileCodeValueId': this.apiData.taxProfileCodeValueId,
      'stateCodeValueId': this.apiData.stateCodeValueId,
      });  
  }  

  patchCity() {
    this.groupForm.patchValue({
      'cityCodeValueId': this.apiData.cityCodeValueId,
      });  
  }    

  createGroupForm() {
    this.groupForm = this.formBuilder.group({
      'companyName': ['', [Validators.required]],
      'nit': ['', [Validators.required]],
      'nitDigit': ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      'address': ['', [Validators.required]],
      'departmentCodeValueId': ['', [Validators.required]],
      'cityCodeValueId': ['', [Validators.required]],
      'liquidationFrequencyCodeValueId': ['', [Validators.required]],
      'applyCupoMaxSell': [false],
      'cupoMaxSell': [''],
      'settledComission': ['', [Validators.required]],
      'buyEnabled': [false],
      'collectionEnabled': [false],
      'bankEntityCodeValueId': [''],
      'accountTypeCodeValueId': [''],
      'accountNumber': [''],
      'taxProfileCodeValueId': [''],
      'stateCodeValueId': [''],
    });
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
    this.clientsalliesService.getCitiesByDepartment(id).subscribe(( apiResponseBody: any ) => {
      console.log(apiResponseBody);
      this.citiesList = apiResponseBody.citiesList;

      this.patchCity();

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

    this.clientsalliesService.editClientsallies(data, this.entityId).subscribe((response: any) => {
      this.router.navigate(['../clientsallies']);
    });    

  }

  reloadCitiesByDepartment(id: any) {
    this.loadCitiesByDepartment(id);
  }

  enableOrDisaabkeCupoMaxSellField(selected: boolean) {
//    this.applyCupoMaxSellChkBox = selected;
//    alert(this.applyCupoMaxSellChkBox);
  }
}
