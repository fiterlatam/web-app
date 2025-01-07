import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateClassificationConceptComponent } from "./create-classification-concept.component";

describe("CreateChargeComponent", () => {
  let component: CreateClassificationConceptComponent;
  let fixture: ComponentFixture<CreateClassificationConceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateClassificationConceptComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClassificationConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
