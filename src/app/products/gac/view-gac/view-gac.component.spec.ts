import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGacComponent } from './view-gac.component';

describe('ViewGacComponent', () => {
  let component: ViewGacComponent;
  let fixture: ComponentFixture<ViewGacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewGacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
