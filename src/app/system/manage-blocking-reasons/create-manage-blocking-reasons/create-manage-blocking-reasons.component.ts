import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from '../../system.service';

@Component({
  selector: 'mifosx-create-manage-blocking-reasons',
  templateUrl: './create-manage-blocking-reasons.component.html',
  styleUrls: ['./create-manage-blocking-reasons.component.scss']
})
export class CreateManageBlockingReasonsComponent implements OnInit {

  
  blockingReasonForm: UntypedFormGroup;
  blockingReasonTemplateData: any;

 
  constructor(private formBuilder: UntypedFormBuilder,
              private systemService: SystemService,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.data.subscribe((data: { manageBlockingReasonTemplateResolver: any }) => {
      this.blockingReasonTemplateData = data.manageBlockingReasonTemplateResolver;
    });
    }


  ngOnInit() {
    this.createBlockingReasonForm();
  }


  // createBlockingReasonForm() {
  //   this.blockingReasonForm = this.formBuilder.group({
  //     level: ['client'],
  //     'creditLevel': [''],
  //     'customerLevel': [''],
  //     'description': '',
  //     'nameOfReason': ['', Validators.required],
  //     'priority': ['', Validators.required],
  //   });
  // }
  createBlockingReasonForm() {
    this.blockingReasonForm = this.formBuilder.group({
      level: ['client'],
      'creditLevel': [''],
      'customerLevel': [''],
      'description': '',
      'nameOfReason': ['', Validators.required],
      'priority': ['', Validators.required],
    });
  
    this.blockingReasonForm.get('level').valueChanges.subscribe(value => {
      if (value === 'credit') {
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
    this.systemService.createBlockingReasonSettings(this.blockingReasonForm.value)
      .subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
    });
  }


}
