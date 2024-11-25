import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'mifosx-insurance-incident-list',
  templateUrl: './insurance-incident-list.component.html',
  styleUrls: ['./insurance-incident-list.component.scss']
})
export class InsuranceIncidentListComponent implements OnInit {
  incidents: any;
  displayedColumns: string[] = ['name', 'type', 'mandatoryInsurance', 'voluntaryInsurance'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private route: ActivatedRoute,
              private router: Router) {
    this.route.data.subscribe((data: { incidents: any }) => {
      this.incidents = data.incidents;
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.incidents);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
