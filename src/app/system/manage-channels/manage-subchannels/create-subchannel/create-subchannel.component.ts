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
  selector: 'mifosx-create-subchannel',
  templateUrl: './create-subchannel.component.html',
  styleUrls: ['./create-subchannel.component.scss']
})


export class CreateSubChannelComponent implements OnInit {

  entityId: any;
  channelId: any;
  apiData: any;

  groupForm: UntypedFormGroup;
  

  constructor(private route: ActivatedRoute,
      private router: Router,
      private subchannelService: SubChannelService,
      private dateUtils: Dates,
      private settingsService: SettingsService,
      private formBuilder: UntypedFormBuilder) {

    console.log("constructor");
  }


  ngOnInit(): void {
    console.log("ngOnInit");
    this.createGroupForm();

    this.entityId = this.route.snapshot.params["id"];
    this.channelId = this.route.snapshot.params["channelId"];    
  }


  createGroupForm() {
    //, Validators.pattern('')
    this.groupForm = this.formBuilder.group({
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

    this.subchannelService.createSubChannel(this.channelId, data).subscribe((response: any) => {
      this.router.navigate(['system/manage-system-channels/'+ this.channelId + '/subchannel']);
    });    
  }

}