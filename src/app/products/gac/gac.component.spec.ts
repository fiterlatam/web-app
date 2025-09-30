import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GacComponent } from './gac.component';

describe('GacComponent', () => {
  let component: GacComponent;
  let fixture: ComponentFixture<GacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
