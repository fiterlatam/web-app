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
import { SubChannelService } from '../subchannel.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';

@Component({
  selector: 'mifosx-edit-subchannel',
  templateUrl: './edit-subchannel.component.html',
  styleUrls: ['./edit-subchannel.component.scss']
})

export class EditSubChannelComponent implements OnInit {

  entityId: any;
  channelId: any;
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
      private subchannelService: SubChannelService,
      private dateUtils: Dates,
      private settingsService: SettingsService,
      private formBuilder: UntypedFormBuilder) {

    console.log("constructor");
  }


  ngOnInit(): void {

    this.entityId = this.route.snapshot.params["id"];
    this.channelId = this.route.snapshot.params["channelId"];

    console.log("ngOnInit");
    this.createGroupForm();

    this.subchannelService.getClientallyById(this.channelId, this.entityId).subscribe(( apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
      console.log("id: " + this.entityId);
      console.log(apiResponseBody);

      this.patchValues();
    });  
  }


  patchValues() {
    this.groupForm.patchValue({
      'channelId': this.apiData.channelId,
      'name': this.apiData.name,
      'description': this.apiData.description,
      'active': this.apiData.active,
      });
  }  


  createGroupForm() {
    //, Validators.pattern('')
    this.groupForm = this.formBuilder.group({
      'channelId': ['', [Validators.required, ]],
      'name': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100) ]],
      'description': ['', [ Validators.maxLength(1000) ]],
      'active': [true],
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

    this.subchannelService.editSubChannel(data, this.channelId, this.entityId).subscribe((response: any) => {
      this.router.navigate(['system/manage-system-channels/'+ this.channelId + '/subchannel']);
    });    

  }

}
