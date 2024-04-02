import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAssignorSelectorComponent } from './loan-assignor-selector.component';

describe('GlAccountSelectorComponent', () => {
  let component: LoanAssignorSelectorComponent;
  let fixture: ComponentFixture<LoanAssignorSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanAssignorSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanAssignorSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
