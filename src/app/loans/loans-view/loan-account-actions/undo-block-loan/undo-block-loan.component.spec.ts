import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoBlockLoanComponent } from './undo-block-loan.component';

describe('UndoBlockLoanComponent', () => {
  let component: UndoBlockLoanComponent;
  let fixture: ComponentFixture<UndoBlockLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndoBlockLoanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UndoBlockLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
