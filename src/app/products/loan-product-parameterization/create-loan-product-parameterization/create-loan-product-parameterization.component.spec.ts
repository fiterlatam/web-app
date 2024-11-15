import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLoanProductParameterizationComponent } from './create-loan-product-parameterization.component';

describe('CreateLoanProductParameterizationComponent', () => {
  let component: CreateLoanProductParameterizationComponent;
  let fixture: ComponentFixture<CreateLoanProductParameterizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLoanProductParameterizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLoanProductParameterizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
