import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'mifosx-advance-quota',
  templateUrl: './advance-quota.component.html',
  styleUrls: ['./advance-quota.component.scss']
})
export class AdvanceQuotaComponent implements OnInit {
  advanceQuotaData: any;
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { advanceQuotaConfiguration: any }) => {
      this.advanceQuotaData = data.advanceQuotaConfiguration;
    });
  }

  ngOnInit() {
  }

}
