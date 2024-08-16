import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsService} from '../../../settings/settings.service';
import {logger} from 'codelyzer/util/logger';
import {InsuranceIncidentService} from '../insurance-incident.service';

@Component({
  selector: 'mifosx-edit-insurance-incident',
  templateUrl: './edit-insurance-incident.component.html',
  styleUrls: ['./edit-insurance-incident.component.scss']
})
export class EditInsuranceIncidentComponent implements OnInit {
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
    this.editIncidentForm();
  }

  editIncidentForm() {
    const locale = this.settingsService.language.code;
    this.incidentForm = this.formBuilder.group({
      'isVoluntary': [this.incidentData.mandatoryInsurance],
      'isMandatory': [this.incidentData.voluntaryInsurance],
      'name': [this.incidentData.name, [Validators.required]]
    }, {validators: this.incidentService.atLeastOneCheckedValidator()});
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
    console.log(JSON.stringify(data));
    this.incidentService.updateIncident(this.incidentData.id, data).subscribe((response: any) => {
      this.router.navigate(['../'], {relativeTo: this.route}).then(r => logger.info('Insurance Incident updated successfully'));
    });
  }

}
