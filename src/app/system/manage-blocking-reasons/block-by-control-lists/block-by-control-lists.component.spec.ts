import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockByControlListsComponent } from './block-by-control-lists.component';

describe('BlockByControlListsComponent', () => {
  let component: BlockByControlListsComponent;
  let fixture: ComponentFixture<BlockByControlListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockByControlListsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockByControlListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
