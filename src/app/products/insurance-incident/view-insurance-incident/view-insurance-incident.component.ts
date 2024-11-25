import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'mifosx-view-insurance-incident',
  templateUrl: './view-insurance-incident.component.html',
  styleUrls: ['./view-insurance-incident.component.scss']
})
export class ViewInsuranceIncidentComponent implements OnInit {
  incidentData: any;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { incident: any }) => {
      this.incidentData = data.incident;
    });
  }

  ngOnInit(): void {
  }

}
