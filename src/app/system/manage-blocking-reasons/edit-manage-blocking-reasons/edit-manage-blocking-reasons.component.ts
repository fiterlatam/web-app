import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from '../../system.service';

@Component({
  selector: 'mifosx-edit-manage-blocking-reasons',
  templateUrl: './edit-manage-blocking-reasons.component.html',
  styleUrls: ['./edit-manage-blocking-reasons.component.scss']
})
export class EditManageBlockingReasonsComponent implements OnInit {

 
  blockingReasonForm: UntypedFormGroup;
  blockingReasonSettingsData: any;
  blockingReasonSettingsTemplateData: any;
  prefixTypeData: any[];


  constructor(private route: ActivatedRoute,
              private formBuilder: UntypedFormBuilder,
              private systemService: SystemService,
              private router: Router) {
    this.route.data.subscribe((data: { viewBlockingReasonItem: any, manageBlockingReasonTemplateResolver: any }) => {
      this.blockingReasonSettingsData = data.viewBlockingReasonItem;
      this.blockingReasonSettingsTemplateData = data.manageBlockingReasonTemplateResolver;
    });
  }

  ngOnInit() {
    this.createBlockingReasonForm();
  }

  createBlockingReasonForm() {
    this.blockingReasonForm = this.formBuilder.group({
      level: ['CLIENT'],
      'creditLevel': [''],
      'customerLevel': [''],
      'description': '',
      'nameOfReason': ['', Validators.required],
      'priority': ['', Validators.required],
    });
  
    this.blockingReasonForm.get('level').valueChanges.subscribe(value => {
      if (value === 'CREDIT') {
       this.blockingReasonForm.get('creditLevel').setValidators(Validators.required);
        this.blockingReasonForm.get('customerLevel').clearValidators();
      } else {
        this.blockingReasonForm.get('customerLevel').setValidators(Validators.required);
        this.blockingReasonForm.get('creditLevel').clearValidators();
      }
  
      this.blockingReasonForm.get('creditLevel').updateValueAndValidity();
      this.blockingReasonForm.get('customerLevel').updateValueAndValidity();
    });
  }

  
  submit() {
    const accountNumberPreferenceValue = this.blockingReasonForm.value;
    if (accountNumberPreferenceValue.prefixType === '') {
      accountNumberPreferenceValue.prefixType = undefined;
    }
    this.systemService.updateBlockReasonSetting(this.blockingReasonSettingsData.id, accountNumberPreferenceValue)
      .subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }

}
