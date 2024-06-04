import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'mifosx-interest-rate',
  templateUrl: './view-interest-rate.component.html',
  styleUrls: ['./view-interest-rate.component.scss']
})
export class ViewInterestRateComponent implements OnInit {
  interestRateData: any;
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { interestRate: any }) => {
      this.interestRateData = data.interestRate;
    });
  }

  ngOnInit() {
  }

}
