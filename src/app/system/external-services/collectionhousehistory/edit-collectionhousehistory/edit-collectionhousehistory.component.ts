import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from 'app/system/system.service';

@Component({
  selector: 'mifosx-edit-collectionhousehistory',
  templateUrl: './edit-collectionhousehistory.component.html',
  styleUrls: ['./edit-collectionhousehistory.component.scss']
})
export class EditCollectionhousehistoryComponent implements OnInit {

  collectionHouseConfigurationData: any;

  collectionHouseConfigurationForm: UntypedFormGroup;
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
                  console.log(data)
                  this.collectionHouseConfigurationData = data?.customChargeHonorarioConfiguration;
                });
              }

  ngOnInit(): void {
    this.createCollectionHouseConfigurationForm();
    this.secretKeyInputType = 'password';
    this.accessKeyInputType = 'password';
  }

  createCollectionHouseConfigurationForm(){
    let urlEntryIndexOnAPIResultset = 0;
    let apiKeyEntryIndexOnAPIResultset = 1;
    console.log(this,this.collectionHouseConfigurationData)
    if(this.collectionHouseConfigurationData[1].name == "COLLECTION_HOUSE_URL") {
      urlEntryIndexOnAPIResultset++;
      apiKeyEntryIndexOnAPIResultset--;
    }
    console.log(this.collectionHouseConfigurationData);
    this.collectionHouseConfigurationForm = this.formBuilder.group({
      'COLLECTION_HOUSE_URL': [this.collectionHouseConfigurationData[urlEntryIndexOnAPIResultset].value, Validators.required],
      'COLLECTION_HOUSE_API_KEY': [this.collectionHouseConfigurationData[apiKeyEntryIndexOnAPIResultset].value, Validators.required]
    });
  }

  submit() {
    this.systemService
      .updateExternalConfiguration('COLLECTION_HOUSE_HISTORY_PROVIDER', this.collectionHouseConfigurationForm.value)
      .subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }

}
