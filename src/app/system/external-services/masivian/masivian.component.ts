import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'mifosx-masivian',
  templateUrl: './masivian.component.html',
  styleUrls: ['./masivian.component.scss']
})
export class MasivianComponent implements OnInit {
  masivianConfigurationData: any;
  displayedColumns: string[] = ['name', 'value'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: {masivianConfiguration: any}) => {
      this.masivianConfigurationData = data.masivianConfiguration;
    });
   }
  ngOnInit() {
    this.setMasivianConfiguration();
  }
  setMasivianConfiguration() {
    this.dataSource = new MatTableDataSource(this.masivianConfigurationData);
    this.dataSource.sort = this.sort;
  }

}
