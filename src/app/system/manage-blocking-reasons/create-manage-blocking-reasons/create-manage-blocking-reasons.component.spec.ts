import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateManageBlockingReasonsComponent } from './create-manage-blocking-reasons.component';

describe('CreateManageBlockingReasonsComponent', () => {
  let component: CreateManageBlockingReasonsComponent;
  let fixture: ComponentFixture<CreateManageBlockingReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateManageBlockingReasonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateManageBlockingReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
