import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionHouseConfigComponent } from './collection-house-config.component';

describe('CollectionHouseConfigComponent', () => {
  let component: CollectionHouseConfigComponent;
  let fixture: ComponentFixture<CollectionHouseConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionHouseConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionHouseConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
