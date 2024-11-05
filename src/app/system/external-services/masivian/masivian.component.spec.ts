import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasivianComponent } from './masivian.component';

describe('SmsComponent', () => {
  let component: MasivianComponent;
  let fixture: ComponentFixture<MasivianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasivianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasivianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
