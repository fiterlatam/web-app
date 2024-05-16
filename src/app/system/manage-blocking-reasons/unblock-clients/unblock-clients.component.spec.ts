import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnblockClientsComponent } from './unblock-clients.component';

describe('UnblockClientsComponent', () => {
  let component: UnblockClientsComponent;
  let fixture: ComponentFixture<UnblockClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnblockClientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnblockClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
