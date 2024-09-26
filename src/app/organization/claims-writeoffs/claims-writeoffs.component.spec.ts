import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsWriteoffsComponent } from './claims-writeoffs.component';

describe('ClaimsWriteoffsComponent', () => {
  let component: ClaimsWriteoffsComponent;
  let fixture: ComponentFixture<ClaimsWriteoffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimsWriteoffsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsWriteoffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
