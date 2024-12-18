import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mifosx-view-collection-house-config',
  templateUrl: './view-collection-house-config.component.html',
  styleUrls: ['./view-collection-house-config.component.scss']
})
export class ViewCollectionHouseConfigComponent implements OnInit {
  collectionHouseData: any;
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { collectionHouse: any }) => {
      this.collectionHouseData = data?.collectionHouse;
    });
   }

  ngOnInit(): void {
  }

}
