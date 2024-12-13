import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditClassificationConceptComponent } from "./edit-classification-concept.component";

describe("EditChargeComponent", () => {
  let component: EditClassificationConceptComponent;
  let fixture: ComponentFixture<EditClassificationConceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditClassificationConceptComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClassificationConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
