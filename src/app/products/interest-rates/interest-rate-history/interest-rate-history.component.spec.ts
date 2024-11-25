import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestRateHistoryComponent } from './interest-rate-history.component';

describe('InterestRateHistoryComponent', () => {
  let component: InterestRateHistoryComponent;
  let fixture: ComponentFixture<InterestRateHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestRateHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestRateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
