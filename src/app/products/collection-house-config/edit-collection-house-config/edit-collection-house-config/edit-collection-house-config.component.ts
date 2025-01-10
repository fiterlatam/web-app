import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CollectionHouseConfigService } from '../../collection-house-config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'app/settings/settings.service';
import { logger } from 'codelyzer/util/logger';

@Component({
  selector: 'mifosx-edit-collection-house-config',
  templateUrl: './edit-collection-house-config.component.html',
  styleUrls: ['./edit-collection-house-config.component.scss']
})
export class EditCollectionHouseConfigComponent implements OnInit {
  collectionHouseForm: UntypedFormGroup;
  collectionHouseData: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private collectionHouseConfigService: CollectionHouseConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService
  ) {
    this.route.data.subscribe((data: { collectionHouse: any }) => {
      this.collectionHouseData = data?.collectionHouse;
    });
   }

  ngOnInit(): void {
    this.editCollectionHouseForm();
  }

  editCollectionHouseForm() {
    
    this.collectionHouseForm = this.formBuilder.group({
      'collectionName': [this.collectionHouseData?.collectionName, [Validators.required]],
      'collectionNit': [this.collectionHouseData?.collectionNit, [Validators.required]],
      'collectionCode': [this.collectionHouseData?.collectionCode, [Validators.required]],
      'collectionVerificationCode': [this.collectionHouseData?.collectionVerificationCode, [Validators.required]],
    });
  }

  submit() {
    const incidentFormData = this.collectionHouseForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const data = {
      ...incidentFormData,
      dateFormat,
      locale
    };
    this.collectionHouseConfigService.updateCollectionHouse(this.collectionHouseData.id, data).subscribe((response: any) => {
      this.router.navigate(['../'], {relativeTo: this.route}).then(r => logger.info('Collection House updated successfully'));
    });
  }

}
