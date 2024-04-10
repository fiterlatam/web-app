import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientallyComponent } from './edit-clientally.component';

describe('EditClientallyComponent', () => {
  let component: EditClientallyComponent;
  let fixture: ComponentFixture<EditClientallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClientallyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditClientallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
