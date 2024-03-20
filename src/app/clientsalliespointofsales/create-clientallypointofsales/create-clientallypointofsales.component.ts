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
import { ClientAllyPointOfSalesService } from '../clientallypointofsales.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';

@Component({
  selector: 'mifosx-create-clientallypointofsales',
  templateUrl: './create-clientallypointofsales.component.html',
  styleUrls: ['./create-clientallypointofsales.component.scss']
})


export class CreateClientAllyPointOfSalesComponent implements OnInit {

  parentId: any;

  apiData: any;

  groupForm: UntypedFormGroup;

  // Template data
  departmentsList: any;
  citiesList: any;
  brandsList: any;
  categoriesList: any;
  segmentsList: any;
  typesList: any;
  statesList: any;

  parentDescriptionAsTitle = "";

  constructor(private route: ActivatedRoute,
      private router: Router,
      private clientsalliesService: ClientAllyPointOfSalesService,
      private dateUtils: Dates,
      private settingsService: SettingsService,
      private formBuilder: UntypedFormBuilder) {

    console.log("constructor");
  }


  ngOnInit(): void {

    this.parentId = this.route.snapshot.paramMap.get("parentId");

    console.log("ngOnInit");
    this.createGroupForm();
    this.loadClientalliesTemplate("ngOnInit");
    this.getDefaultValuesFromParent();
    this.getValuesFromParent();
  }


  getDefaultValuesFromParent() {
    this.clientsalliesService.getDefaultValuesFromParent(this.parentId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;

      this.groupForm.patchValue({
        'settledComission': this.apiData.settledComission,
        'buyEnabled': this.apiData.buyEnabled,
        'collectionEnabled': this.apiData.collectionEnabled,
        'stateCodeValueId': this.apiData.stateCodeValueId,
      });  
    });      
  }


  createGroupForm() {
    //, Validators.pattern('^[\S]{4}$')
    this.groupForm = this.formBuilder.group({
//      'clientallyid': ['', [Validators.required, ]],
      'code': ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{1,4}$')]], 
      'name': ['', [Validators.required, ]],
      'brandCodeValueId': ['', [Validators.required, ]],
      'cityCodeValueId': ['', [Validators.required, ]],
      'departmentCodeValueId': ['', [Validators.required, ]],
      'categoryCodeValueId': ['', [Validators.required, ]],
      'segmentCodeValueId': ['', [Validators.required, ]],
      'typeCodeValueId': ['', [Validators.required, ]],
      'settledComission': ['', [Validators.required, ]],
      'buyEnabled': [''],
      'collectionEnabled': [''],
      'stateCodeValueId': ['', [Validators.required, ]],
    });
  }


  loadClientalliesTemplate(requestFrom: String) {
    console.log("clientsallies " + requestFrom);

    this.clientsalliesService.getTemplate(this.parentId).subscribe(( apiResponseBody: any ) => {
      console.log(apiResponseBody);

      this.departmentsList = apiResponseBody.departmentsList;
      this.brandsList = apiResponseBody.brandsList;
      this.categoriesList = apiResponseBody.categoriesList;
      this.segmentsList = apiResponseBody.segmentsList;
      this.typesList = apiResponseBody.typesList;
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

    this.clientsalliesService.createClientAllyPointOfSales(this.parentId, data).subscribe((response: any) => {
      this.router.navigate([`/clientally/${this.parentId}/pointofsales`]);
    });    
  }


  reloadCitiesByDepartment(id: any) {
    this.loadCitiesByDepartment(id);
  }

  getValuesFromParent() {
    this.clientsalliesService.getDefaultValuesFromParent(this.parentId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;

      this.parentDescriptionAsTitle = this.apiData.companyName + " - NIT: " + this.apiData.nit;
 
    });      
  }  

}
