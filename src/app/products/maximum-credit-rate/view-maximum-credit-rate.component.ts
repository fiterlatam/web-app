/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * View Maximum Credit Rate component.
 */
@Component({
  selector: 'mifosx-view-maximum-credit-rate',
  templateUrl: './view-maximum-credit-rate.component.html',
  styleUrls: ['./view-maximum-credit-rate.component.scss']
})
export class ViewMaximumCreditRateComponent implements OnInit {

  /** Maximum Credit Rate Data. */
  maximumCreditRateData: any;

  /**
   * Retrieves the Maximum Credit Rate data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { maximumCreditRate: any }) => {
      this.maximumCreditRateData = data.maximumCreditRate;
    });
  }

  ngOnInit() {
  }

}
