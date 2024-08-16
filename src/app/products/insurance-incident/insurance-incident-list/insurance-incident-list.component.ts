import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfigurationWizardService} from '../../../configuration-wizard/configuration-wizard.service';
import {PopoverService} from '../../../configuration-wizard/popover/popover.service';

@Component({
  selector: 'mifosx-insurance-incident-list',
  templateUrl: './insurance-incident-list.component.html',
  styleUrls: ['./insurance-incident-list.component.scss']
})
export class InsuranceIncidentListComponent implements OnInit {
  loanProductsData: any;
  displayedColumns: string[] = [ 'name', 'name', 'mandatoryInsurance', 'voluntaryInsurance'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private configurationWizardService: ConfigurationWizardService,
              private popoverService: PopoverService) {
    this.route.data.subscribe((data: { loanProducts: any }) => {
      this.loanProductsData = data.loanProducts;
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.loanProductsData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
