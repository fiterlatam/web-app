import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceQuotaComponent } from './advance-quota.component';

describe('AdvanceQuotaComponent', () => {
  let component: AdvanceQuotaComponent;
  let fixture: ComponentFixture<AdvanceQuotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceQuotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
