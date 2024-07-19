import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ViewChargeMapComponent} from './view-charge-map.component';

describe('ViewChargeMapComponent', () => {
  let component: ViewChargeMapComponent;
  let fixture: ComponentFixture<ViewChargeMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewChargeMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChargeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
