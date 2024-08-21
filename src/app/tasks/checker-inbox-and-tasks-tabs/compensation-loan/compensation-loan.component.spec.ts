import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationLoanComponent } from './compensation-loan.component';

describe('CompensationLoanComponent', () => {
  let component: CompensationLoanComponent;
  let fixture: ComponentFixture<CompensationLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompensationLoanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompensationLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
