import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'mifosx-view-loan-product-parameterization',
  templateUrl: './view-loan-product-parameterization.component.html',
  styleUrls: ['./view-loan-product-parameterization.component.scss']
})
export class ViewLoanProductParameterizationComponent implements OnInit {
  loanProductParameterization: any;
  constructor(private route: ActivatedRoute,
              private router: Router) {
    this.route.data.subscribe((data: { loanProductParameterization: any }) => {
      this.loanProductParameterization = data.loanProductParameterization;
      
    });
  }

  ngOnInit(): void {
  }

}
