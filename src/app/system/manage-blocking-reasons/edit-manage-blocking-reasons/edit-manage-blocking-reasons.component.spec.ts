import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManageBlockingReasonsComponent } from './edit-manage-blocking-reasons.component';

describe('EditManageBlockingReasonsComponent', () => {
  let component: EditManageBlockingReasonsComponent;
  let fixture: ComponentFixture<EditManageBlockingReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditManageBlockingReasonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditManageBlockingReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
