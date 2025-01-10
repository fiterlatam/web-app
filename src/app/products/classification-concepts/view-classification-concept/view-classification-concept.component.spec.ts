import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ViewClassficationConceptComponent } from "./view-classification-concept.component";

describe("ViewChargeComponent", () => {
  let component: ViewClassficationConceptComponent;
  let fixture: ComponentFixture<ViewClassficationConceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewClassficationConceptComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClassficationConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
