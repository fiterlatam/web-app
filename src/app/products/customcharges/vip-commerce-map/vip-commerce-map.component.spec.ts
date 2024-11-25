import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {VipCommerceMapComponent} from './vip-commerce-map.component';


describe('VipCommerceMapComponent', () => {
  let component: VipCommerceMapComponent;
  let fixture: ComponentFixture<VipCommerceMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VipCommerceMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VipCommerceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
