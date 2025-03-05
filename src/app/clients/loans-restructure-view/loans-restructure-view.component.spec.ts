import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansRestructureViewComponent } from './loans-restructure-view.component';

describe('LoansRestructureViewComponent', () => {
  let component: LoansRestructureViewComponent;
  let fixture: ComponentFixture<LoansRestructureViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoansRestructureViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoansRestructureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
