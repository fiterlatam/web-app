import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {CreateChargeMapComponent} from './create-charge-map.component';

describe('CreateChargeMapComponent', () => {
  let component: CreateChargeMapComponent;
  let fixture: ComponentFixture<CreateChargeMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateChargeMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChargeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
