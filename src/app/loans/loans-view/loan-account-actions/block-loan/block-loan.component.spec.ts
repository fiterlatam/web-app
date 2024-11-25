import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockLoanComponent } from './block-loan.component';

describe('BlockLoanComponent', () => {
  let component: BlockLoanComponent;
  let fixture: ComponentFixture<BlockLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockLoanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
