import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdvanceQuotaComponent } from './edit-advance-quota.component';

describe('EditAdvanceQuotaComponent', () => {
  let component: EditAdvanceQuotaComponent;
  let fixture: ComponentFixture<EditAdvanceQuotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAdvanceQuotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdvanceQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
