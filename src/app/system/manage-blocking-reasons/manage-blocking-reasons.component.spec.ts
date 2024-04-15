import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBlockingReasonsComponent } from './manage-blocking-reasons.component';

describe('ManageBlockingReasonsComponent', () => {
  let component: ManageBlockingReasonsComponent;
  let fixture: ComponentFixture<ManageBlockingReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageBlockingReasonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBlockingReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
