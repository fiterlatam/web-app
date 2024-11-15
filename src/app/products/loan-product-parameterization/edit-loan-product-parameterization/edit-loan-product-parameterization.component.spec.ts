import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoanProductParameterizationComponent } from './edit-loan-product-parameterization.component';

describe('EditLoanProductParameterizationComponent', () => {
  let component: EditLoanProductParameterizationComponent;
  let fixture: ComponentFixture<EditLoanProductParameterizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLoanProductParameterizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLoanProductParameterizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
