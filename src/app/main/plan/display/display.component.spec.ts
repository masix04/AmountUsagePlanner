import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDisplayComponent } from './display.component';

describe('PlanDisplayComponent', () => {
  let component: PlanDisplayComponent;
  let fixture: ComponentFixture<PlanDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
