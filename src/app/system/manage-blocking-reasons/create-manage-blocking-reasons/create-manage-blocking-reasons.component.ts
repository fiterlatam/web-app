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

  
  roleForm: UntypedFormGroup;

 
  constructor(private formBuilder: UntypedFormBuilder,
              private systemService: SystemService,
              private route: ActivatedRoute,
              private router: Router) { }


  ngOnInit() {
    this.createRoleForm();
  }


  createRoleForm() {
    this.roleForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required]
    });
  }


  submit() {
    this.systemService.createRole(this.roleForm.value)
      .subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
    });
  }


}
