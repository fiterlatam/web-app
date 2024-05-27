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
import { ChannelService } from '../channel.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';

@Component({
  selector: 'mifosx-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})


export class CreateChannelComponent implements OnInit {

  apiData: any;

  groupForm: UntypedFormGroup;


  constructor(private route: ActivatedRoute,
      private router: Router,
      private channelService: ChannelService,
      private dateUtils: Dates,
      private settingsService: SettingsService,
      private formBuilder: UntypedFormBuilder) {

    console.log("constructor");
  }


  ngOnInit(): void {
    console.log("ngOnInit");
    this.createGroupForm();
  }


  createGroupForm() {
    //, Validators.pattern('')
    this.groupForm = this.formBuilder.group({
      'hash': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5000)]],
      'name': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100) ]],
      'description': ['', [ Validators.required, Validators.maxLength(1000) ]],
      'active': [true],
    });

    this.groupForm.updateValueAndValidity();
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

    this.channelService.createChannel(data).subscribe((response: any) => {
      this.router.navigate(['system/manage-system-channels/']);
    });    
  }

}
