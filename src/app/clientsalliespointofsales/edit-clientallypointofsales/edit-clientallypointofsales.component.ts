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

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
  selector: 'mifosx-edit-clientallypointofsales',
  templateUrl: './edit-clientallypointofsales.component.html',
  styleUrls: ['./edit-clientallypointofsales.component.scss']
})

export class EditClientAllyPointOfSalesComponent implements OnInit {

  parentId: any;
  entityId: any;
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
      private clientallypointofsalesService: ClientAllyPointOfSalesService,
      private dateUtils: Dates,
      private settingsService: SettingsService,
      private formBuilder: UntypedFormBuilder) {

    console.log("constructor");
  }


  ngOnInit(): void {

    this.parentId = this.route.snapshot.params["parentId"];
    this.entityId = this.route.snapshot.params["id"];


    console.log("ngOnInit");
    this.createGroupForm();

    console.log("this.parentId: " + this.parentId);
    console.log("this.entityId: " + this.entityId);

    this.clientallypointofsalesService.getClientallyById(this.parentId, this.entityId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
      console.log("id: " + this.entityId);
      console.log(apiResponseBody);

      this.loadClientalliesTemplate("ngOnInit");
      this.loadCitiesByDepartment(apiResponseBody.departmentCodeValueId);
      this.patchValues();
    });  

    this.getDefaultValuesFromParent();

  }

  patchValues() {
    this.groupForm.patchValue({
      'name': this.apiData.name,
      'code': this.apiData.code,
      'brandCodeValueId': this.apiData.brandCodeValueId,
      'cityCodeValueId': this.apiData.cityCodeValueId,
      'departmentCodeValueId': this.apiData.departmentCodeValueId,      
      'categoryCodeValueId': this.apiData.categoryCodeValueId,
      'segmentCodeValueId': this.apiData.segmentCodeValueId,
      'typeCodeValueId': this.apiData.typeCodeValueId,
      'settledComission': this.apiData.settledComission,
      'buyEnabled': this.apiData.buyEnabled,
      'collectionEnabled': this.apiData.collectionEnabled,
      'stateCodeValueId': this.apiData.stateCodeValueId,
      });  
  }  


  patchCity() {
    this.groupForm.patchValue({
      'cityCodeValueId': this.apiData.cityCodeValueId,
      });  
  }    

  createGroupForm() {
    //, Validators.pattern('')
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

    this.clientallypointofsalesService.getTemplate(this.parentId).subscribe(( apiResponseBody: any ) => {
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
    this.clientallypointofsalesService.getCitiesByDepartment(id).subscribe(( apiResponseBody: any ) => {
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

    this.clientallypointofsalesService.editClientAllyPointOfSales(data, this.parentId, this.entityId).subscribe((response: any) => {
      this.router.navigate([`/clientally/${this.parentId}/pointofsales`]);
    });    

  }

  reloadCitiesByDepartment(id: any) {
    this.loadCitiesByDepartment(id);
  }


  getDefaultValuesFromParent() {
    this.clientallypointofsalesService.getDefaultValuesFromParent(this.parentId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;

      this.parentDescriptionAsTitle = this.apiData.companyName + " - NIT: " + this.apiData.nit;
 
    });      
  }

}