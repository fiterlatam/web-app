import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManageBlockingReasonsComponent } from './view-manage-blocking-reasons.component';

describe('ViewManageBlockingReasonsComponent', () => {
  let component: ViewManageBlockingReasonsComponent;
  let fixture: ComponentFixture<ViewManageBlockingReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewManageBlockingReasonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewManageBlockingReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
