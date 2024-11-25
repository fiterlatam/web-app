import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { ViewInterestRateComponent } from './view-interest-rate.component';

describe('ViewInterestRateComponent', () => {
  let component: ViewInterestRateComponent;
  let fixture: ComponentFixture<ViewInterestRateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInterestRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInterestRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
