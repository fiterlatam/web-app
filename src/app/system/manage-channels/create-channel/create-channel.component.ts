import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ChannelService } from '../channel.service';
import { SettingsService } from 'app/settings/settings.service';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'mifosx-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})


export class CreateChannelComponent implements OnInit {
  apiData: any;
  groupForm: UntypedFormGroup;
  channelTypeOptions: any;
  constructor(private route: ActivatedRoute,
      private router: Router,
      private channelService: ChannelService,
      private settingsService: SettingsService,
      private formBuilder: UntypedFormBuilder) {
    this.route.data.subscribe((data: { channelTemplate: any }) => {
      this.channelTypeOptions = data.channelTemplate?.channelTypeOptions;
    });
  }

  ngOnInit(): void {
    this.createGroupForm();
  }

  createGroupForm() {
    this.groupForm = this.formBuilder.group({
      'hash': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5000)]],
      'name': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100) ]],
      'channelType': ['', Validators.required],
      'description': ['', [ Validators.maxLength(1000) ]],
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
      this.router.navigate(['system/manage-system-channels/']).then(r => logger.info('Channel created successfully'));
    });
  }

}
