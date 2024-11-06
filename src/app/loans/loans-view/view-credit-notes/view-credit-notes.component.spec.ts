import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCreditNotesComponent } from './view-credit-notes.component';

describe('ViewCreditNotesComponent', () => {
  let component: ViewCreditNotesComponent;
  let fixture: ComponentFixture<ViewCreditNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCreditNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCreditNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
