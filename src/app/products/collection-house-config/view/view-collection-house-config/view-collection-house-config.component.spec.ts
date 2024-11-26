import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCollectionHouseConfigComponent } from './view-collection-house-config.component';

describe('ViewCollectionHouseConfigComponent', () => {
  let component: ViewCollectionHouseConfigComponent;
  let fixture: ComponentFixture<ViewCollectionHouseConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCollectionHouseConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCollectionHouseConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
