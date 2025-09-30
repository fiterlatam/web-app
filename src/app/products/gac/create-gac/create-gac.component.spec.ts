import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGacComponent } from './create-gac.component';

describe('CreateGacComponent', () => {
  let component: CreateGacComponent;
  let fixture: ComponentFixture<CreateGacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
