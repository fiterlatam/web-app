import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {EditChargeMapComponent} from './edit-charge-map.component';

describe('EditChargeMapComponent', () => {
  let component: EditChargeMapComponent;
  let fixture: ComponentFixture<EditChargeMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditChargeMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChargeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
