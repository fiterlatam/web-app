import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInterestRateComponent } from './edit-interest-rate.component';

describe('EditInterestRateComponent', () => {
  let component: EditInterestRateComponent;
  let fixture: ComponentFixture<EditInterestRateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInterestRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInterestRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
