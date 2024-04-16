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


  createBlockingReasonForm() {
    this.blockingReasonForm = this.formBuilder.group({
      level: ['client'],
      'creditLevel': ['', Validators.required],
      'customerLevel': ['', Validators.required],
      'description': '',
      'nameOfReason': ['', Validators.required],
      'priority': ['', Validators.required],
    });
  }


  submit() {
    this.systemService.createBlockingReasonSettings(this.blockingReasonForm.value)
      .subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
    });
  }


}
