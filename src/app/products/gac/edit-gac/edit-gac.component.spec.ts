import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGacComponent } from './edit-gac.component';

describe('EditGacComponent', () => {
  let component: EditGacComponent;
  let fixture: ComponentFixture<EditGacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
