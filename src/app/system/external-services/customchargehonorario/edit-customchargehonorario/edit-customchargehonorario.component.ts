/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

/** Custom Services */
import { SystemService } from 'app/system/system.service';

/**
 * Edit Amazon S3 Component.
 */
@Component({
  selector: 'mifosx-edit-customchargehonorario',
  templateUrl: './edit-customchargehonorario.component.html',
  styleUrls: ['./edit-customchargehonorario.component.scss']
})
export class EditCustomChargeHonorarioComponent implements OnInit {

  /** Amazon S3 Configuration data */
  amazonS3ConfigurationData: any;
  /** Amazon S3 Configuration Form */
  amazonS3ConfigurationForm: UntypedFormGroup;
  /** Secret Key input field type. */
  secretKeyInputType: string;
  /** Access Key field type. */
  accessKeyInputType: string;

  /**
   * Retrieves the Amazon S3 configuration data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {SystemService} systemService Accounting Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   */
  constructor(private formBuilder: UntypedFormBuilder,
              private systemService: SystemService,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.data.subscribe((data: { customChargeHonorarioConfiguration: any }) => {
      this.amazonS3ConfigurationData = data.customChargeHonorarioConfiguration;
    });
  }

  /**
   * Creates Amazon S3 configuration form.
   */
  ngOnInit() {
    this.createAmazonS3ConfigurationForm();
    this.secretKeyInputType = 'password';
    this.accessKeyInputType = 'password';
  }

  /**
   * Creates Amazon S3 configuration form.
   */
  createAmazonS3ConfigurationForm() {

    let urlEntryIndexOnAPIResultset = 0;
    let apiKeyEntryIndexOnAPIResultset = 1;
    if(this.amazonS3ConfigurationData[1].name == "URL") {
      urlEntryIndexOnAPIResultset++;
      apiKeyEntryIndexOnAPIResultset--;
    }

    this.amazonS3ConfigurationForm = this.formBuilder.group({
      'URL': [this.amazonS3ConfigurationData[urlEntryIndexOnAPIResultset].value, Validators.required],
      'API_KEY': [this.amazonS3ConfigurationData[apiKeyEntryIndexOnAPIResultset].value, Validators.required]
    });
  }

  /**
   * Submits the Amazon S3 configuration and updates the Amazon S3 configuration,
   * if successful redirects to view Amazon S3 configuration.
   */
  submit() {
    this.systemService
      .updateExternalConfiguration('CUSTOM_CHARGE_HONORARIO_PROVIDER', this.amazonS3ConfigurationForm.value)
      .subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }

}
