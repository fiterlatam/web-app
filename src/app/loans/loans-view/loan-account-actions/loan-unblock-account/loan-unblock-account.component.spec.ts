import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanUnblockAccountComponent } from './loan-unblock-account.component';

describe('LoanUnblockAccountComponent', () => {
  let component: LoanUnblockAccountComponent;
  let fixture: ComponentFixture<LoanUnblockAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanUnblockAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanUnblockAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
