import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLoanProductParameterizationComponent } from './view-loan-product-parameterization.component';

describe('ViewLoanProductParameterizationComponent', () => {
  let component: ViewLoanProductParameterizationComponent;
  let fixture: ComponentFixture<ViewLoanProductParameterizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLoanProductParameterizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLoanProductParameterizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
