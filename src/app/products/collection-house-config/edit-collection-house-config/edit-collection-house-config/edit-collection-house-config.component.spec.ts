import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCollectionHouseConfigComponent } from './edit-collection-house-config.component';

describe('EditCollectionHouseConfigComponent', () => {
  let component: EditCollectionHouseConfigComponent;
  let fixture: ComponentFixture<EditCollectionHouseConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCollectionHouseConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCollectionHouseConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
