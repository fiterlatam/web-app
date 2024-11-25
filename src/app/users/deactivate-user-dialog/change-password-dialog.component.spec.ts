import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateUserDialogComponent } from './deactivate-user-dialog.component';

describe('DeactivateUserDialogComponent', () => {
  let component: DeactivateUserDialogComponent;
  let fixture: ComponentFixture<DeactivateUserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivateUserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
