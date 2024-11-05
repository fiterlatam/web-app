import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { EditMasivianComponent } from './edit-masivian.component';

describe('EditMasivianComponent', () => {
  let component: EditMasivianComponent;
  let fixture: ComponentFixture<EditMasivianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMasivianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMasivianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
