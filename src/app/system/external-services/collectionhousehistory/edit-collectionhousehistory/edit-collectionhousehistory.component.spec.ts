import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCollectionhousehistoryComponent } from './edit-collectionhousehistory.component';

describe('EditCollectionhousehistoryComponent', () => {
  let component: EditCollectionhousehistoryComponent;
  let fixture: ComponentFixture<EditCollectionhousehistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCollectionhousehistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCollectionhousehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
