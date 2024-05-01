import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBlockingReasonDialogComponent } from './client-blocking-reason-dialog.component';

describe('ClientBlockingReasonDialogComponent', () => {
  let component: ClientBlockingReasonDialogComponent;
  let fixture: ComponentFixture<ClientBlockingReasonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientBlockingReasonDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientBlockingReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
