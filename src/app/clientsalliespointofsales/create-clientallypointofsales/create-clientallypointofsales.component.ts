import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

/** Custom Services */
import { ClientAllyPointOfSalesService } from '../clientallypointofsales.service';
import { SettingsService } from 'app/settings/settings.service';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'mifosx-create-clientallypointofsales',
  templateUrl: './create-clientallypointofsales.component.html',
  styleUrls: ['./create-clientallypointofsales.component.scss']
})
export class CreateClientAllyPointOfSalesComponent implements OnInit {

  constructor(private route: ActivatedRoute,
      private router: Router,
      private clientsalliesService: ClientAllyPointOfSalesService,
      private settingsService: SettingsService,
      private formBuilder: UntypedFormBuilder) {
  }
  parentId: any;
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

  protected readonly console = console;

  ngOnInit(): void {
    this.parentId = this.route.snapshot.paramMap.get('parentId');
    this.createGroupForm();
    this.loadClientalliesTemplate('ngOnInit');
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
    this.groupForm = this.formBuilder.group({
      'code': ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{1,6}$')]],
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
      'stateCodeValueId': ['', [Validators.required, ]],
    });
  }

  loadClientalliesTemplate(requestFrom: String) {
    this.clientsalliesService.getTemplate(this.parentId).subscribe(( apiResponseBody: any ) => {
      this.departmentsList = apiResponseBody.departmentsList;
      this.brandsList = apiResponseBody.brandsList;
      this.categoriesList = apiResponseBody.categoriesList;
      this.segmentsList = apiResponseBody.segmentsList;
      this.typesList = apiResponseBody.typesList;
      this.statesList = apiResponseBody.statesList;

    });
  }

  loadCitiesByDepartment(id: any) {
      this.clientsalliesService.getCitiesByDepartment(id).subscribe(( apiResponseBody: any ) => {
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
      this.router.navigate([`/clientally/${this.parentId}/pointofsales`]).then(r => logger.info('Point of sale successfully created'));
    });
  }

  reloadCitiesByDepartment(id: any) {
    this.loadCitiesByDepartment(id);
  }

  getValuesFromParent() {
    this.clientsalliesService.getDefaultValuesFromParent(this.parentId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
      this.parentDescriptionAsTitle = this.apiData.companyName + ' - NIT: ' + this.apiData.nit;
    });
  }
}
