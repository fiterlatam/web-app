import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLoanProductParameterizationListComponent } from './view-loan-product-parameterization-list.component';

describe('ViewLoanProductParameterizationListComponent', () => {
  let component: ViewLoanProductParameterizationListComponent;
  let fixture: ComponentFixture<ViewLoanProductParameterizationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLoanProductParameterizationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLoanProductParameterizationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
