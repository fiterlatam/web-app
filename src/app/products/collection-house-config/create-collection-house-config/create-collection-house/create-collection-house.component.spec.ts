import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCollectionHouseComponent } from './create-collection-house.component';

describe('CreateCollectionHouseComponent', () => {
  let component: CreateCollectionHouseComponent;
  let fixture: ComponentFixture<CreateCollectionHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCollectionHouseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCollectionHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
