import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsService} from '../../../settings/settings.service';
import {InsuranceIncidentService} from '../insurance-incident.service';

@Component({
  selector: 'mifosx-create-insurance-incident',
  templateUrl: './create-insurance-incident.component.html',
  styleUrls: ['./create-insurance-incident.component.scss']
})
export class CreateInsuranceIncidentComponent implements OnInit {
  incidentForm: UntypedFormGroup;
  incidentData: any;


  constructor(private formBuilder: UntypedFormBuilder,
              private incidentService: InsuranceIncidentService,
              private route: ActivatedRoute,
              private router: Router,
              private settingsService: SettingsService) {
                this.route.data.subscribe((data: { incident: any }) => {
                      this.incidentData = data.incident;
                    });

  }

  ngOnInit(): void {
    this.createIncidentForm();
  }


  createIncidentForm() {
    const locale = this.settingsService.language.code;
    this.incidentForm = this.formBuilder.group({
      'isVoluntary': [false],
      'isMandatory': [false],
      'name': ['', [Validators.required]],
      'incidentType': ['', Validators.required]
    }, { validators: this.incidentService.validateInsuranceIncidentForm() });
  }

  submit() {
    const incidentFormData = this.incidentForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const data = {
      ...incidentFormData,
      dateFormat,
      locale
    };
    this.incidentService.createIncident(data).subscribe((response: any) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
