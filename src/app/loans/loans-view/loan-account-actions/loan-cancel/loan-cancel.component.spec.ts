import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanCancelComponent } from './loan-cancel.component';

describe('LoanCancelComponent', () => {
  let component: LoanCancelComponent;
  let fixture: ComponentFixture<LoanCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
