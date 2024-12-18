import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionhousehistoryComponent } from './collectionhousehistory.component';

describe('CollectionhousehistoryComponent', () => {
  let component: CollectionhousehistoryComponent;
  let fixture: ComponentFixture<CollectionhousehistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionhousehistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionhousehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
