import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoTransactionsComponent } from './undo-transactions.component';

describe('UndoTransactionsComponent', () => {
  let component: UndoTransactionsComponent;
  let fixture: ComponentFixture<UndoTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndoTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UndoTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
