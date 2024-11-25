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
    this.route.data.subscribe((data: { viewBlockingReasonItem: any}) => {
      this.blockingReasonSettingsData = data.viewBlockingReasonItem;
    });
  }

  ngOnInit() {
    this.createBlockingReasonForm();
    this.blockingReasonForm.patchValue({
      'priority': this.blockingReasonSettingsData.priority,
      'nameOfReason': this.blockingReasonSettingsData.nameOfReason,
      'description': this.blockingReasonSettingsData.description
    });
    if (this.blockingReasonSettingsData && this.blockingReasonSettingsData.level) {
      this.blockingReasonForm.get('level').setValue(this.blockingReasonSettingsData.level);
    }
  }

  createBlockingReasonForm() {
    this.blockingReasonForm = this.formBuilder.group({
      level: ['',Validators.required],
      'description': '',
      'nameOfReason': ['', Validators.required],
      'priority': ['', Validators.required],
    });
  }

  
  submit() {
    const blockingReasonFormValue = this.blockingReasonForm.value;
    
    this.systemService.updateBlockReasonSetting(this.blockingReasonSettingsData.id, null, blockingReasonFormValue)
      .subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }

}
