import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

/** Custom Services */
import { ClientAllyPointOfSalesService } from '../clientallypointofsales.service';
import { SettingsService } from 'app/settings/settings.service';
import {logger} from 'codelyzer/util/logger';

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
  departmentsList: any;
  citiesList: any;
  brandsList: any;
  categoriesList: any;
  segmentsList: any;
  typesList: any;
  statesList: any;
  parentDescriptionAsTitle = '';

  constructor(private route: ActivatedRoute,
      private router: Router,
      private clientallypointofsalesService: ClientAllyPointOfSalesService,
      private settingsService: SettingsService,
      private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.parentId = this.route.snapshot.params['parentId'];
    this.entityId = this.route.snapshot.params['id'];
    this.createGroupForm();
    this.clientallypointofsalesService.getClientallyById(this.parentId, this.entityId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
      this.loadClientalliesTemplate('ngOnInit');
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
    this.groupForm = this.formBuilder.group({
      'code': ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{1,4}$')]],
      'name': ['', [Validators.required, Validators.maxLength(100)]],
      'brandCodeValueId': ['', [Validators.required]],
      'cityCodeValueId': ['', [Validators.required]],
      'departmentCodeValueId': ['', [Validators.required]],
      'categoryCodeValueId': ['', [Validators.required]],
      'segmentCodeValueId': ['', [Validators.required]],
      'typeCodeValueId': ['', [Validators.required]],
      'settledComission': ['', [Validators.required]],
      'buyEnabled': [''],
      'collectionEnabled': [''],
      'stateCodeValueId': ['', [Validators.required]],
    });
  }

  loadClientalliesTemplate(requestFrom: String) {
    this.clientallypointofsalesService.getTemplate(this.parentId).subscribe(( apiResponseBody: any ) => {
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
      this.router.navigate([`/clientally/${this.parentId}/pointofsales`]).then(r => logger.info('Navigate to point of sales'));
    });

  }

  reloadCitiesByDepartment(id: any) {
    this.loadCitiesByDepartment(id);
  }

  getDefaultValuesFromParent() {
    this.clientallypointofsalesService.getDefaultValuesFromParent(this.parentId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
      this.parentDescriptionAsTitle = this.apiData.companyName + ' - NIT: ' + this.apiData.nit;
    });
  }

}
