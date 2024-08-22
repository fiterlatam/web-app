import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialWriteOffComponent } from './special-write-off.component';

describe('SpecialWriteOffPageComponent', () => {
  let component: SpecialWriteOffComponent;
  let fixture: ComponentFixture<SpecialWriteOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialWriteOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialWriteOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
