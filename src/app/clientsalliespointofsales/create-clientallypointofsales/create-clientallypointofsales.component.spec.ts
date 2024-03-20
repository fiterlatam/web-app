import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientallypointofsalesComponent } from './create-clientallypointofsales.component';

describe('CreateClientallypointofsalesComponent', () => {
  let component: CreateClientallypointofsalesComponent;
  let fixture: ComponentFixture<CreateClientallypointofsalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateClientallypointofsalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClientallypointofsalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
