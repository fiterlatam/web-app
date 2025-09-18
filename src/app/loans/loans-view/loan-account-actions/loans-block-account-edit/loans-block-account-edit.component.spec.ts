import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansBlockAccountEditComponent } from './loans-block-account-edit.component';

describe('LoansBlockAccountEditComponent', () => {
  let component: LoansBlockAccountEditComponent;
  let fixture: ComponentFixture<LoansBlockAccountEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoansBlockAccountEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoansBlockAccountEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
