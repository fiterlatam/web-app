import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockingReasonDialogComponent } from './blocking-reason-dialog.component';

describe('BlockingReasonDialogComponent', () => {
  let component: BlockingReasonDialogComponent;
  let fixture: ComponentFixture<BlockingReasonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockingReasonDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockingReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
