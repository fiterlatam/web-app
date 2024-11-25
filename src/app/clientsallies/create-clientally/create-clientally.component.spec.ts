import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientallyComponent } from './create-clientally.component';

describe('CreateClientallyComponent', () => {
  let component: CreateClientallyComponent;
  let fixture: ComponentFixture<CreateClientallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateClientallyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClientallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
