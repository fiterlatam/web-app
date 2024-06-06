import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ChannelService } from '../channel.service';
import { SettingsService } from 'app/settings/settings.service';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'mifosx-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})

export class EditChannelComponent implements OnInit {
  entityId: any;
  apiData: any;
  channelTypeOptions: any;
  groupForm: UntypedFormGroup;
  constructor(private route: ActivatedRoute,
      private router: Router,
      private channelService: ChannelService,
      private settingsService: SettingsService,
      private formBuilder: UntypedFormBuilder) {
  }


  ngOnInit(): void {
    this.entityId = this.route.snapshot.params['id'];
    this.createGroupForm();
    this.channelService.getChannelById(this.entityId, true).subscribe((apiResponseBody: any ) => {
      this.apiData = apiResponseBody;
      this.channelTypeOptions = this.apiData['channelTypeOptions'];
      this.patchValues();
    });
  }

  patchValues() {
    this.groupForm.patchValue({
      'hash': this.apiData.hash,
      'name': this.apiData.name,
      'channelType': this.apiData.channelType ? this.apiData.channelType.id : null,
      'description': this.apiData.description,
      'active': this.apiData.active,
      });
  }

  createGroupForm() {
    this.groupForm = this.formBuilder.group({
      'hash': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5000)]],
      'name': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100) ]],
      'channelType': ['', Validators.required],
      'description': ['', [Validators.maxLength(1000)]],
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

    this.channelService.editChannel(data, this.entityId).subscribe((response: any) => {
      this.router.navigate(['system/manage-system-channels/']).then(r => logger.info('Channel Updated Successfully'));
    });
  }

}
