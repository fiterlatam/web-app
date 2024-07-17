import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChargeMap } from './create-charge-map.component';

describe('CreateInterestRateComponent', () => {
  let component: CreateChargeMap;
  let fixture: ComponentFixture<CreateChargeMap>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateChargeMap ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChargeMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
