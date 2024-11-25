import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { SystemService } from 'app/system/system.service';
import {logger} from 'codelyzer/util/logger';
@Component({
  selector: 'mifosx-edit-masivian',
  templateUrl: './edit-masivian.component.html',
  styleUrls: ['./edit-masivian.component.scss']
})
export class EditMasivianComponent implements OnInit {
  masivianConfigurationData: any;
  masivianConfigurationForm: UntypedFormGroup;
  constructor(private formBuilder: UntypedFormBuilder,
              private systemService: SystemService,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.data.subscribe((data: { masivianConfiguration: any }) => {
      this.masivianConfigurationData = data.masivianConfiguration;
    });
  }
  ngOnInit() {
    this.setMasivianConfigurationForm();
  }
  setMasivianConfigurationForm() {
    this.masivianConfigurationForm = this.formBuilder.group({
      'SMS_API_URL': [this.masivianConfigurationData[0].value, Validators.required],
      'SMS_API_AUTHORIZATION_HEADER': [this.masivianConfigurationData[1].value, Validators.required],
      'SMS_API_ENABLED': [this.masivianConfigurationData[2].value === 'true', Validators.required],
    });
  }
  submit() {
    this.systemService
      .updateExternalConfiguration('MASIVIAN_SERVICE', this.masivianConfigurationForm.value)
      .subscribe((response: any) => {
        this.router.navigate(['../'], {relativeTo: this.route}).then(() => logger.info('Masivian Configuration successfully updated!'));
      });
  }

}
