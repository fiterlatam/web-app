import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CollectionHouseConfigService } from '../../collection-house-config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-create-collection-house',
  templateUrl: './create-collection-house.component.html',
  styleUrls: ['./create-collection-house.component.scss']
})
export class CreateCollectionHouseComponent implements OnInit {
  collectionHouseForm: UntypedFormGroup;
  collectionHouseData: any;
  constructor(private formBuilder: UntypedFormBuilder,
    private collectionHouseConfigService: CollectionHouseConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService) {
      this.route.data.subscribe((data: { collectionHouse: any }) => {
        this.collectionHouseData = data?.collectionHouse;
      });
     }

  ngOnInit(): void {
    this.createCollectionHouseorm();
  }
  createCollectionHouseorm() {
    this.collectionHouseForm = this.formBuilder.group({
      'collectionName': ['', [Validators.required]],
      'collectionNit': ['', [Validators.required]],
      'collectionCode': ['', [Validators.required]],
      'collectionVerificationCode': ['', [Validators.required]],
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
    this.collectionHouseConfigService.createCollectionHouse(data).subscribe((response: any) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

}
