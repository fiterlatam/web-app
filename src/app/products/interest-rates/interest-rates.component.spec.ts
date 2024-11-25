import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestRatesComponent } from './interest-rates.component';

describe('InterestRatesComponent', () => {
  let component: InterestRatesComponent;
  let fixture: ComponentFixture<InterestRatesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
