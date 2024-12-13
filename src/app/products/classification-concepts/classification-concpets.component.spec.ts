import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ClassificationConceptsComponent } from "./classification-concepts.component";

describe("ClassificationConceptsComponent", () => {
  let component: ClassificationConceptsComponent;
  let fixture: ComponentFixture<ClassificationConceptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClassificationConceptsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationConceptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
